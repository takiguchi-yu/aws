module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true,
    },
    "extends": "eslint:recommended",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "rules": {
        "indent": [
            "error",
            4,
            {"SwitchCase": 1}   // 0:インデントなし、1:インデントあり
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "always"
        ],
        // 使われていない変数はエラーにする
        "no-unused-vars": [
            "error",
            {
                "vars": "all",
                "args": "none"
            }
        ],
        "no-console": [
            "off"
        ]
    }
};