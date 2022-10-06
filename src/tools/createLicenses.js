const checker = require("license-checker");
const fs = require("fs");

checker.init(
    {
        start: "./",
        production: true,
        json: true,
        customFormat: "./src/tools/customFormat.json",
    },
    function (err, packages) {
        if (err) {
            console.error(err);
        } else {
            let text = "";
            for (key in packages) {
                if (packages[key]["licenses"] !== "UNLICENSED") {
                    text +=
                        key + "\n\n" + packages[key]["licenseText"] + "\n\n";
                }
            }
            fs.writeFile("NOTICE.txt", text, (err) => {
                if (err) console.error(err);
            });
        }
    }
);
