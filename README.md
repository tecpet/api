![tecpet-api](https://img.shields.io/badge/npm%20package-1.0.3-brightgreen.svg)

# tecpet-api
API calls and usage description for the tecpet platform

# Installation

    # installing the tecpet api package
    npm i @tecpet/api --save

# Usage

    var api = require("@tecpet/api")
    api.getShopGeneralInfo().then(result => {console.log(result)});
