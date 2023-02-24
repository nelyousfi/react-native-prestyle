import reactNativeStyleAttributes from "react-native/Libraries/Components/View/ReactNativeStyleAttributes";

const useTheme = "theme______";
const useBreakPoint = "breakPoint______";
const useViewVariants = "viewVariants______";
const useTextVariants = "textVariants______";

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
      t.identifier(useTheme),
      t.identifier(dynamicProp["themeKey"])
    ),
    attribute.value.type === "JSXExpressionContainer"
      ? attribute.value.expression
      : t.identifier(attribute.value.value),
    attribute.value.type === "JSXExpressionContainer"
  );
}

function getComponentProps(t, openingElement, isThemedView) {
  return openingElement.attributes.reduce(
    (acc, attribute) => {
      if (t.isJSXAttribute(attribute)) {
        const propName = attribute.name.name;
        let dynamicProp;
        if (propName === "variant") {
          acc[2] = t.callExpression(
            t.memberExpression(
              t.callExpression(
                t.memberExpression(
                  t.identifier("Object"),
                  t.identifier("entries")
                ),
                [
                  t.memberExpression(
                    t.identifier(
                      isThemedView ? useViewVariants : useTextVariants
                    ),
                    attribute.value.type === "JSXExpressionContainer"
                      ? attribute.value.expression
                      : attribute.value,
                    true
                  ),
                ]
              ),
              t.identifier("reduce")
            ),
            [
              t.arrowFunctionExpression(
                [
                  t.identifier("acc"),
                  t.ArrayPattern([t.identifier("key"), t.identifier("value")]),
                ],
                t.blockStatement([
                  t.variableDeclaration("const", [
                    t.variableDeclarator(
                      t.identifier("dynamicThemeProps"),
                      t.arrayExpression(
                        dynamicThemeProps.map((prop) =>
                          t.objectExpression([
                            t.objectProperty(
                              t.identifier("name"),
                              t.stringLiteral(prop.name)
                            ),
                            t.objectProperty(
                              t.identifier("themeKey"),
                              t.stringLiteral(prop.themeKey)
                            ),
                          ])
                        )
                      )
                    ),
                  ]),
                  t.variableDeclaration("const", [
                    t.variableDeclarator(
                      t.identifier("dynamicThemeProp"),
                      t.callExpression(
                        t.memberExpression(
                          t.identifier("dynamicThemeProps"),
                          t.identifier("find")
                        ),
                        [
                          t.arrowFunctionExpression(
                            [t.identifier("prop")],
                            t.binaryExpression(
                              "===",
                              t.memberExpression(
                                t.identifier("prop"),
                                t.identifier("name")
                              ),
                              t.identifier("key")
                            )
                          ),
                        ]
                      )
                    ),
                  ]),
                  t.returnStatement(
                    t.objectExpression([
                      t.spreadElement(t.identifier("acc")),
                      t.objectProperty(
                        t.identifier("key"),
                        t.conditionalExpression(
                          t.identifier("dynamicThemeProp"),
                          t.memberExpression(
                            t.memberExpression(
                              t.identifier(useTheme),
                              t.memberExpression(
                                t.identifier("dynamicThemeProp"),
                                t.identifier("themeKey")
                              ),
                              true
                            ),
                            t.identifier("value"),
                            true
                          ),
                          t.identifier("value")
                        ),
                        true
                      ),
                    ])
                  ),
                ])
              ),
              t.objectExpression([]),
            ]
          );
        } else if (
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
                    buildThemeValue(t, attribute, dynamicProp),
                    true
                  ),
                  t.stringLiteral("object")
                ),
                t.memberExpression(
                  buildThemeValue(t, attribute, dynamicProp),
                  t.identifier(useBreakPoint),
                  true
                ),
                buildThemeValue(t, attribute, dynamicProp)
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
      }
      return acc;
    },
    [[], [], t.objectExpression([])]
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

function injectStyleProp(t, openingElement, styledProps, variant) {
  openingElement.attributes.unshift(
    t.jsxAttribute(
      t.jsxIdentifier("style"),
      t.jsxExpressionContainer(
        t.arrayExpression([t.objectExpression(styledProps), variant])
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
            if (
              ["ThemedView", "ThemedText"].includes(openingElement.name.name)
            ) {
              const isThemedView = openingElement.name.name === "ThemedView";
              const [styledProps, nativeProps, variant] = getComponentProps(
                t,
                openingElement,
                isThemedView
              );
              if (styledProps.length > 0 || variant) {
                // we can import this directly from the context
                importNamed(t, path, "react-native-prestyle", "useTheme");
                importNamed(t, path, "react-native-prestyle", "useBreakPoint");
                isThemedView
                  ? importNamed(
                      t,
                      path,
                      "react-native-prestyle",
                      "useViewVariants"
                    )
                  : importNamed(
                      t,
                      path,
                      "react-native-prestyle",
                      "useTextVariants"
                    );
                injectFunction(t, nodePath, useTheme, "useTheme");
                injectFunction(t, nodePath, useBreakPoint, "useBreakPoint");
                isThemedView
                  ? injectFunction(
                      t,
                      nodePath,
                      useViewVariants,
                      "useViewVariants"
                    )
                  : injectFunction(
                      t,
                      nodePath,
                      useTextVariants,
                      "useTextVariants"
                    );

                // build the style prop
                const hasStyleProp = buildStyle(
                  t,
                  openingElement,
                  nativeProps,
                  styledProps,
                  variant
                );

                // add style prop if it does not exist
                !hasStyleProp &&
                  injectStyleProp(t, openingElement, styledProps, variant);
              }
            }
          },
        });
      },
    },
  };
}
