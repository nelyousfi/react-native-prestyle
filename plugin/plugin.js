import reactNativeStyleAttributes from "react-native/Libraries/Components/View/ReactNativeStyleAttributes";
import { parse } from "@babel/parser";
import generate from "@babel/generator";

const theme = "theme";
const breakPoint = "breakPoint";
const viewVariants = "viewVariants";
const textVariants = "textVariants";

// TODO: import this from outside
const dynamicThemeProps = [
  // colors
  {
    name: "backgroundColor",
    themeKey: "colors",
  },
  {
    name: "color",
    themeKey: "colors",
  },
  // spacing
  {
    name: "margin",
    themeKey: "spacing",
  },
  {
    name: "marginVertical",
    themeKey: "spacing",
  },
  {
    name: "marginHorizontal",
    themeKey: "spacing",
  },
  {
    name: "marginRight",
    themeKey: "spacing",
  },
  {
    name: "marginLeft",
    themeKey: "spacing",
  },
  {
    name: "marginTop",
    themeKey: "spacing",
  },
  {
    name: "marginBottom",
    themeKey: "spacing",
  },
  {
    name: "padding",
    themeKey: "spacing",
  },
  {
    name: "paddingVertical",
    themeKey: "spacing",
  },
  {
    name: "paddingHorizontal",
    themeKey: "spacing",
  },
  {
    name: "paddingRight",
    themeKey: "spacing",
  },
  {
    name: "paddingLeft",
    themeKey: "spacing",
  },
  {
    name: "paddingTop",
    themeKey: "spacing",
  },
  {
    name: "paddingBottom",
    themeKey: "spacing",
  },
];

function parseCode(code) {
  const ast = parse(code, {
    sourceType: "module",
    plugins: ["jsx"],
  });
  return ast.program.body[0];
}

function generateCodeFromValue(t, attribute) {
  const value = t.isJSXExpressionContainer(attribute.value)
    ? attribute.value.expression
    : attribute.value;
  const code = generate(value);
  return code.code;
}

function buildStyleProp(t, openingElement) {
  const isThemedView = openingElement.name.name === "ThemedView";
  const [dynamicStyleProp, staticStyleProp] = openingElement.attributes.reduce(
    (acc, attribute) => {
      const propName = attribute.name.name;
      let dynamicProp;
      if (propName === "variant") {
        acc[0] = `{
        ...${acc[0]},
        ...Object.entries(${
          isThemedView ? viewVariants : textVariants
        }[${generateCodeFromValue(t, attribute)}]).reduce((acc2, [k, v]) => {
            const dynamicProps = [${dynamicThemeProps.map((prop) =>
              JSON.stringify(prop)
            )}]
            const dynamicProp = dynamicProps.find(prop => prop.name === k);
            return {
              ...acc2,
              [k]: dynamicProp ? ${theme}[dynamicProp.themeKey][v]?.[${breakPoint}] ? ${theme}[dynamicProp.themeKey][v][${breakPoint}] : ${theme}[dynamicProp.themeKey][v] : v,
            };
          }, {}),
        }`;
      } else if (
        (dynamicProp = dynamicThemeProps.find(({ name }) => name === propName))
      ) {
        const key = generateCodeFromValue(t, attribute);
        acc[0] = `{
        ...${acc[0]},
        ${propName}: ${theme}.${dynamicProp["themeKey"]}[${key}]?.[${breakPoint}] ?? ${theme}.${dynamicProp["themeKey"]}[${key}],
      }`;
      } else if (reactNativeStyleAttributes[propName]) {
        acc[0] = `{
        ...${acc[0]},
        ${propName}: ${generateCodeFromValue(t, attribute)},
      }`;
      } else if (propName === "style") {
        acc[1] = attribute.value.expression;
      }
      return acc;
    },
    ["{}", t.objectExpression([])]
  );

  return [parseCode(`[${dynamicStyleProp}]`).expression, staticStyleProp];
}

function injectBuildStyleProp(
  t,
  openingElement,
  dynamicStyleProp,
  staticStyleProp
) {
  openingElement.attributes.push(
    t.jsxAttribute(
      t.jsxIdentifier("buildStyle"),
      t.jsxExpressionContainer(
        t.arrowFunctionExpression(
          [
            t.objectPattern([
              t.objectProperty(t.identifier(theme), t.identifier(theme)),
              t.objectProperty(
                t.identifier(breakPoint),
                t.identifier(breakPoint)
              ),
              t.objectProperty(
                t.identifier(viewVariants),
                t.identifier(viewVariants)
              ),
              t.objectProperty(
                t.identifier(textVariants),
                t.identifier(textVariants)
              ),
            ]),
          ],
          t.arrayExpression([
            ...dynamicStyleProp.elements,
            ...(t.isArrayExpression(staticStyleProp)
              ? staticStyleProp.elements
              : [staticStyleProp]),
          ])
        )
      )
    )
  );
}

export default function (babel) {
  const t = babel.types;
  return {
    visitor: {
      Program(path) {
        path.traverse({
          JSXElement(nodePath) {
            const openingElement = nodePath.node.openingElement;
            const propName = openingElement.name.name;
            if (["ThemedView", "ThemedText"].includes(propName)) {
              const [dynamicStyleProp, staticStyleProp] = buildStyleProp(
                t,
                openingElement
              );

              injectBuildStyleProp(
                t,
                openingElement,
                dynamicStyleProp,
                staticStyleProp
              );
            }
          },
        });
      },
    },
  };
}
