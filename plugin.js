import reactNativeStyleAttributes from "react-native/Libraries/Components/View/ReactNativeStyleAttributes";

function getComponentProps(t, openingElement) {
  const dynamicThemeProps = [
    {
      name: "backgroundColor",
      themeKey: "colors",
    },
  ];

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
              t.memberExpression(
                t.memberExpression(
                  t.identifier("theme______"),
                  t.identifier(dynamicProp["themeKey"])
                ),
                t.identifier(
                  attribute.value.type === "JSXExpressionContainer"
                    ? attribute.value.expression.value
                    : attribute.value.value
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

function importUseTheme(t, path) {
  path.unshiftContainer(
    "body",
    t.importDeclaration(
      [t.importSpecifier(t.identifier("useTheme"), t.identifier("useTheme"))],
      t.stringLiteral("react-native-prestyle")
    )
  );
}

function injectUseTheme(t, nodePath) {
  const blockStatementPath = nodePath.find((p) => p.isBlockStatement());
  blockStatementPath.unshiftContainer(
    "body",
    t.variableDeclaration("const", [
      t.variableDeclarator(
        t.identifier("theme______"), // what if is already imported, we can just rename this identifier!
        t.callExpression(t.identifier("useTheme"), [])
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

function debug(styledProps) {
  styledProps.forEach((style) => {
    console.log(`${style.key.name}::${style.value.extra.raw}`);
  });
  console.log("-----");
}

function injectStyleProp(t, openingElement, styledProps) {
  openingElement.attributes.push(
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
      Program(path, state) {
        path.traverse({
          JSXElement(nodePath) {
            const openingElement = nodePath.node.openingElement;
            if (openingElement.name.name === "ThemedView") {
              // split component props
              const [styledProps, nativeProps] = getComponentProps(
                t,
                openingElement
              );
              if (styledProps.length > 0) {
                // import useTheme
                importUseTheme(t, path);

                // const theme = useTheme()
                injectUseTheme(t, nodePath);

                // build the style prop
                const hasStyleProp = buildStyle(
                  t,
                  openingElement,
                  nativeProps,
                  styledProps
                );

                // debug
                state.opts.debug && debug(styledProps);

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
