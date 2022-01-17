require( "@babel/register" )( {
    presets: [ "@babel/preset-env" ],
    plugins: [
    "@loadable/babel-plugin",
        [
            "css-modules-transform",
            {
                camelCase: true,
                extensions: [ ".css", ".scss" ],
            },
        ],
        "dynamic-import-node",
    ],
} );
require( "./src/server" );
