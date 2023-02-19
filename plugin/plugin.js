import reactNativeStyleAttributes from "react-native/Libraries/Components/View/ReactNativeStyleAttributes";

const useTheme = "theme______";
const useBreakPoint = "breakPoint______";

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

function getComponentProps(t, openingElement) {
  return openingElement.attributes.reduce(
    (acc, attribute) => {
      if (t.isJSXAttribute(attribute)) {
        const propName = attribute.name.name;
        let dynamicProp;
        if (
          (dynamicProp = dynamicThemeProps.find(
            ({ name }) => name === propName
          ))
        ) {
          acc[0].push(
            t.objectProperty(
              t.identifier(propName),
              // typeof theme.spacing.s === 'object' ? theme.spacing.s[breakPoint] : theme.spacing.s;
              t.conditionalExpression(
                t.binaryExpression(
                  "===",
                  t.unaryExpression(
                    "typeof",
                    t.memberExpression(
                      t.memberExpression(
                        t.identifier(useTheme),
                        t.identifier(dynamicProp["themeKey"])
                      ),
                      attribute.value.type === "JSXExpressionContainer"
                        ? attribute.value.expression.type === "Identifier"
                          ? attribute.value.expression
                          : t.identifier(attribute.value.expression.value)
                        : t.identifier(attribute.value.value),
                      // computed -> { backgroundColor={backgroundColor} }
                      attribute.value.type === "JSXExpressionContainer" &&
                        attribute.value.expression.type === "Identifier"
                    ),
                    true
                  ),
                  t.stringLiteral("object")
                ),
                t.memberExpression(
                  t.memberExpression(
                    t.memberExpression(
                      t.identifier(useTheme),
                      t.identifier(dynamicProp["themeKey"])
                    ),
                    attribute.value.type === "JSXExpressionContainer"
                      ? attribute.value.expression.type === "Identifier"
                        ? attribute.value.expression
                        : t.identifier(attribute.value.expression.value)
                      : t.identifier(attribute.value.value),
                    // computed -> { backgroundColor={backgroundColor} }
                    attribute.value.type === "JSXExpressionContainer" &&
                      attribute.value.expression.type === "Identifier"
                  ),
                  t.identifier(useBreakPoint),
                  true
                ),
                t.memberExpression(
                  t.memberExpression(
                    t.identifier(useTheme),
                    t.identifier(dynamicProp["themeKey"])
                  ),
                  attribute.value.type === "JSXExpressionContainer"
                    ? attribute.value.expression.type === "Identifier"
                      ? attribute.value.expression
                      : t.identifier(attribute.value.expression.value)
                    : t.identifier(attribute.value.value),
                  // computed -> { backgroundColor={backgroundColor} }
                  attribute.value.type === "JSXExpressionContainer" &&
                    attribute.value.expression.type === "Identifier"
                )
              )
            )
          );
        } else if (reactNativeStyleAttributes[propName]) {
          acc[0].push(
            t.objectProperty(
              t.identifier(propName),
              attribute.value.type === "JSXExpressionContainer"
                ? // flex={1}
                  attribute.value.expression
                : // flexDirection="row"
                  attribute.value
            )
          );
        } else {
          acc[1].push(attribute);
        }
        return acc;
      }
    },
    [[], []]
  );
}

function importNamed(t, path, packageName, namedImport) {
  path.unshiftContainer(
    "body",
    t.importDeclaration(
      [t.importSpecifier(t.identifier(namedImport), t.identifier(namedImport))],
      t.stringLiteral(packageName)
    )
  );
}

function injectFunction(t, nodePath, name, functionName) {
  const blockStatementPath = nodePath.find((p) => p.isBlockStatement());
  blockStatementPath.unshiftContainer(
    "body",
    t.variableDeclaration("const", [
      t.variableDeclarator(
        t.identifier(name), // what if is already imported, we can just rename this identifier!
        t.callExpression(t.identifier(functionName), [])
      ),
    ])
  );
}

function buildStyle(t, openingElement, nativeProps, styledProps) {
  let hasStyleProp = false;
  openingElement.attributes = nativeProps.map((attribute) => {
    if (t.isJSXAttribute(attribute) && attribute.name.name === "style") {
      hasStyleProp = true;
      let expression;
      if (t.isMemberExpression(attribute.value.expression)) {
        // style={styles.container} => style={[styleObjectProperties, styles.container]}
        expression = t.arrayExpression([
          t.objectExpression(styledProps),
          attribute.value.expression,
        ]);
      } else if (t.isArrayExpression(attribute.value.expression)) {
        // style={[...]} => append the new style properties to the start the array
        expression = t.arrayExpression([
          t.objectExpression(styledProps),
          ...attribute.value.expression.elements,
        ]);
      } else if (t.isObjectExpression(attribute.value.expression)) {
        // style={{...}} => append the new style properties to the start of the object
        expression = t.objectExpression([
          ...styledProps,
          ...attribute.value.expression.properties,
        ]);
      }
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

function injectStyleProp(t, openingElement, styledProps) {
  openingElement.attributes.unshift(
    t.jsxAttribute(
      t.jsxIdentifier("style"),
      t.jsxExpressionContainer(t.objectExpression(styledProps))
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
            if (
              ["ThemedView", "ThemedText"].includes(openingElement.name.name)
            ) {
              // split component props
              const [styledProps, nativeProps] = getComponentProps(
                t,
                openingElement
              );
              if (styledProps.length > 0) {
                importNamed(t, path, "react-native-prestyle", "useTheme");
                importNamed(t, path, "react-native-prestyle", "useBreakPoint");
                injectFunction(t, nodePath, useTheme, "useTheme");
                injectFunction(t, nodePath, useBreakPoint, "useBreakPoint");

                // build the style prop
                const hasStyleProp = buildStyle(
                  t,
                  openingElement,
                  nativeProps,
                  styledProps
                );

                // add style prop if it does not exist
                !hasStyleProp &&
                  injectStyleProp(t, openingElement, styledProps);
              }
            }
          },
        });
      },
    },
  };
}
