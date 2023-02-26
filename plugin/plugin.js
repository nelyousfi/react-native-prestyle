import reactNativeStyleAttributes from "react-native/Libraries/Components/View/ReactNativeStyleAttributes";
import * as parser from "@babel/parser";
import generate from "@babel/generator";

const theme = "theme______";
const breakPoint = "breakPoint______";
const viewVariants = "viewVariants______";
const textVariants = "textVariants______";

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

function buildThemeValue(t, attribute, dynamicProp) {
  return t.memberExpression(
    t.memberExpression(
      t.identifier(theme),
      t.identifier(dynamicProp["themeKey"])
    ),
    attribute.value.type === "JSXExpressionContainer"
      ? attribute.value.expression
      : t.identifier(attribute.value.value),
    attribute.value.type === "JSXExpressionContainer"
  );
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
  const dynamicProps = openingElement.attributes.reduce((acc, attribute) => {
    const propName = attribute.name.name;
    let dynamicProp;
    if (propName === "variant") {
      return `{
        ...${acc},
        ...Object.entries(${
          isThemedView ? viewVariants : textVariants
        }[${generateCodeFromValue(t, attribute)}]).reduce((acc2, [k, v]) => {
          const dynamicProps = [${dynamicThemeProps.map((prop) =>
            JSON.stringify(prop)
          )}]
          const dynamicProp = dynamicProps.find(prop => prop.name === k);
          return {
            ...acc2,
            [k]: dynamicProp ? ${theme}[dynamicProp.themeKey][v] : v,
          };
        }, {}),
      }`;
    } else if (
      (dynamicProp = dynamicThemeProps.find(({ name }) => name === propName))
    ) {
      return `{
        ...${acc},
        ${propName}: ${theme}.${
        dynamicProp["themeKey"]
      }[${generateCodeFromValue(t, attribute)}],
      }`;
    } else if (reactNativeStyleAttributes[propName]) {
      return `{
        ...${acc},
        ${propName}: ${generateCodeFromValue(t, attribute)},
      }`;
    } else if (propName === "style") {
      return `{
        ...${acc},
        ...${generateCodeFromValue(t, attribute)},
      }`;
    }
    return acc;
  }, "{}");
  console.log({
    dynamicProps,
  });
  const code = `
    [
      ${dynamicProps}
    ]
  `;
  return parseCode(code).expression;

  // return openingElement.attributes.reduce(
  //   (acc, attribute) => {
  //     if (t.isJSXAttribute(attribute)) {
  //       const propName = attribute.name.name;
  //       let dynamicProp;
  //       if (propName === "variant") {
  //         acc[2] = t.callExpression(
  //           t.memberExpression(
  //             t.callExpression(
  //               t.memberExpression(
  //                 t.identifier("Object"),
  //                 t.identifier("entries")
  //               ),
  //               [
  //                 t.memberExpression(
  //                   t.identifier(isThemedView ? viewVariants : textVariants),
  //                   attribute.value.type === "JSXExpressionContainer"
  //                     ? attribute.value.expression
  //                     : attribute.value,
  //                   true
  //                 ),
  //               ]
  //             ),
  //             t.identifier("reduce")
  //           ),
  //           [
  //             t.arrowFunctionExpression(
  //               [
  //                 t.identifier("acc"),
  //                 t.ArrayPattern([t.identifier("key"), t.identifier("value")]),
  //               ],
  //               t.blockStatement([
  //                 t.variableDeclaration("const", [
  //                   t.variableDeclarator(
  //                     t.identifier("dynamicThemeProps"),
  //                     t.arrayExpression(
  //                       dynamicThemeProps.map((prop) =>
  //                         t.objectExpression([
  //                           t.objectProperty(
  //                             t.identifier("name"),
  //                             t.stringLiteral(prop.name)
  //                           ),
  //                           t.objectProperty(
  //                             t.identifier("themeKey"),
  //                             t.stringLiteral(prop.themeKey)
  //                           ),
  //                         ])
  //                       )
  //                     )
  //                   ),
  //                 ]),
  //                 t.variableDeclaration("const", [
  //                   t.variableDeclarator(
  //                     t.identifier("dynamicThemeProp"),
  //                     t.callExpression(
  //                       t.memberExpression(
  //                         t.identifier("dynamicThemeProps"),
  //                         t.identifier("find")
  //                       ),
  //                       [
  //                         t.arrowFunctionExpression(
  //                           [t.identifier("prop")],
  //                           t.binaryExpression(
  //                             "===",
  //                             t.memberExpression(
  //                               t.identifier("prop"),
  //                               t.identifier("name")
  //                             ),
  //                             t.identifier("key")
  //                           )
  //                         ),
  //                       ]
  //                     )
  //                   ),
  //                 ]),
  //                 t.returnStatement(
  //                   t.objectExpression([
  //                     t.spreadElement(t.identifier("acc")),
  //                     t.objectProperty(
  //                       t.identifier("key"),
  //                       t.conditionalExpression(
  //                         t.identifier("dynamicThemeProp"),
  //                         t.memberExpression(
  //                           t.memberExpression(
  //                             t.identifier(theme),
  //                             t.memberExpression(
  //                               t.identifier("dynamicThemeProp"),
  //                               t.identifier("themeKey")
  //                             ),
  //                             true
  //                           ),
  //                           t.identifier("value"),
  //                           true
  //                         ),
  //                         t.identifier("value")
  //                       ),
  //                       true
  //                     ),
  //                   ])
  //                 ),
  //               ])
  //             ),
  //             t.objectExpression([]),
  //           ]
  //         );
  //       } else if (
  //         (dynamicProp = dynamicThemeProps.find(
  //           ({ name }) => name === propName
  //         ))
  //       ) {
  //         acc[0].push(
  //           t.objectProperty(
  //             t.identifier(propName),
  //             // typeof theme.spacing.s === 'object' ? theme.spacing.s[breakPoint] : theme.spacing.s;
  //             t.conditionalExpression(
  //               t.binaryExpression(
  //                 "===",
  //                 t.unaryExpression(
  //                   "typeof",
  //                   buildThemeValue(t, attribute, dynamicProp),
  //                   true
  //                 ),
  //                 t.stringLiteral("object")
  //               ),
  //               t.memberExpression(
  //                 buildThemeValue(t, attribute, dynamicProp),
  //                 t.identifier(breakPoint),
  //                 true
  //               ),
  //               buildThemeValue(t, attribute, dynamicProp)
  //             )
  //           )
  //         );
  //       } else if (reactNativeStyleAttributes[propName]) {
  //         acc[0].push(
  //           t.objectProperty(
  //             t.identifier(propName),
  //             attribute.value.type === "JSXExpressionContainer"
  //               ? // flex={1}
  //                 attribute.value.expression
  //               : // flexDirection="row"
  //                 attribute.value
  //           )
  //         );
  //       } else {
  //         acc[1].push(attribute);
  //       }
  //     }
  //     return acc;
  //   },
  //   [[], [], t.objectExpression([])]
  // );
}

function parseCode(code) {
  const ast = parser.parse(code, {
    sourceType: "module",
    plugins: ["jsx"],
  });
  return ast.program.body[0];
}

function importDependecies(path) {
  const code = `import {usePrestyle} from 'react-native-prestyle'`;
  path.unshiftContainer("body", parseCode(code));
}

function declareHooks(nodePath) {
  const blockStatementPath = nodePath.find((p) => p.isBlockStatement());
  const code = `const {theme: ${theme}, breakPoint: ${breakPoint}, viewVariants: ${viewVariants}, textVariants: ${textVariants}} = usePrestyle()`;
  blockStatementPath.unshiftContainer("body", parseCode(code));
}

function buildStyle(t, openingElement, nativeProps, styledProps, variant) {
  let hasStyleProp = false;
  openingElement.attributes = nativeProps.map((attribute) => {
    if (t.isJSXAttribute(attribute) && attribute.name.name === "style") {
      hasStyleProp = true;
      const expression = t.arrayExpression([
        t.objectExpression(styledProps),
        variant,
        attribute.value.expression,
      ]);
      return {
        ...attribute,
        value: {
          ...attribute.value,
          expression,
        },
      };
    }
    return attribute;
  });
  return hasStyleProp;
}

function injectStyleProp(t, openingElement, styleProp) {
  openingElement.attributes.unshift(
    t.jsxAttribute(
      t.jsxIdentifier("style"),
      t.jsxExpressionContainer(styleProp)
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
              // import usePrestyle
              // TODO: check if the import is already imported
              importDependecies(path);

              // declare all the hooks
              // TODO: check if the hook is already declared
              declareHooks(nodePath);

              const styleProp = buildStyleProp(t, openingElement);

              // add style prop if it does not exist
              injectStyleProp(t, openingElement, styleProp);
            }
          },
        });
      },
    },
  };
}
