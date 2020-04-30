import Swal from "sweetalert2";

const appPlugin = {
    showalert: function (title, text, icon, button) {
        Swal.fire({
            title: title,
            text: text || "",
            icon: icon,
            confirmButtonText: button
        });
    },
    sortactivitytime(array) {
        return array.sort(function (a, b) {
            if (
                parseInt(a.begin.split(":")[0]) -
                parseInt(b.begin.split(":")[0]) ===
                0
            ) {
                return (
                    parseInt(a.begin.split(":")[1]) -
                    parseInt(b.begin.split(":")[1])
                );
            } else {
                return (
                    parseInt(a.begin.split(":")[0]) -
                    parseInt(b.begin.split(":")[0])
                );
            }
        });
    },
    sortclubtime(array) {
        return array.sort(function (a, b) {
            if (
                parseInt(a.begin.split(":")[0]) -
                parseInt(b.begin.split(":")[0]) ===
                0
            ) {
                return (
                    parseInt(a.begin.split(":")[1]) -
                    parseInt(b.begin.split(":")[1])
                );
            } else {
                return (
                    parseInt(a.begin.split(":")[0]) -
                    parseInt(b.begin.split(":")[0])
                );
            }
        });
    },
    sorttime(array) {
        return array.sort(function (a, b) {
            if (
                parseInt(a.beginDate.split(":")[0]) -
                parseInt(b.beginDate.split(":")[0]) ===
                0
            ) {
                return (
                    parseInt(a.beginDate.split(":")[1]) -
                    parseInt(b.beginDate.split(":")[1])
                );
            } else {
                return (
                    parseInt(a.beginDate.split(":")[0]) -
                    parseInt(b.beginDate.split(":")[0])
                );
            }
        });
    },
    ImageValidator(file) {
        let accepted = ["jpg", "jpeg", "png"];
        for (let i = 0; i < file.length; i++) {
            let index = file[i].name.lastIndexOf(".");
            let ext = file[i].name.slice(index + 1, file[i].name.length);
            let found = accepted.find(item => {
                return item == ext;
            });
            if (!found) {
                return false;
            }
        }
    },
    //adozgen
    showConfirm: (...params) => {
        const confirm = Swal.fire({
            title: params[1] || "Emin misiniz?",
            text:
                params[0] ||
                "Bu veriyi silmek üzeresiniz. Geri alma işlemi yapamazsınız.",
            icon: "warning",
            showCancelButton: params[2] || true,
            confirmButtonColor: params[3] || "#3085d6",
            cancelButtonColor: params[4] || "#d33",
            confirmButtonText: params[5] || "Evet Sil!",
            cancelButtonText: params[6] || "Vazgeç"
        });
        return confirm;
    },
    //adozgen

    checktc: function (value) {
        value = value.toString();
        var isEleven = /^[0-9]{11}$/.test(value);
        var totalX = 0;
        for (var i = 0; i < 10; i++) {
            totalX += Number(value.substr(i, 1));
        }
        var isRuleX = totalX % 10 == value.substr(10, 1);
        var totalY1 = 0;
        var totalY2 = 0;
        for (var i = 0; i < 10; i += 2) {
            totalY1 += Number(value.substr(i, 1));
        }
        for (var i = 1; i < 10; i += 2) {
            totalY2 += Number(value.substr(i, 1));
        }
        var isRuleY = (totalY1 * 7 - totalY2) % 10 == value.substr(9, 0);
        return isEleven && isRuleX && isRuleY;
    },

    exportExcelTable(tableData, fileName, punto, tableFields, tableHeaders) {
        var punto = punto | "12";
        var table =
            '<table border="1" class="1" width="100%" id="test-html-table" data-cols-width="10,40,10,40,30,20">';
        table += "<tbody>";
        table += "<tr>";
        tableHeaders.forEach(header => {
            table +=
                '<td class="header" data-fill-color="ffffff"  data-b-t-s="thin" data-b-b-s="thin" data-b-l-s="thin" data-b-r-s="thick"  colspan="1" data-f-sz="10" data-f-color="000000" data-a-h="center" data-a-v="center" >';
            table += header;
            table += "</td>";
        });
        table += "</tr>";
        tableData.forEach(element => {
            table += "<tr>";
            tableFields.forEach(el => {
                table +=
                    '<td data-fill-color="ffffff"  data-b-t-s="thin" data-b-b-s="thin" data-b-l-s="thin" data-b-r-s="thin"  class="header" colspan="1" data-f-sz=' +
                    punto +
                    'data-f-color="ffffff" data-a-h="center" data-a-v="center" >';
                table += element[el];
                table += "</td>";
            });
        });
        table += "</table>";
        var excelName = fileName + ".xlsx";
        var el = document.createElement("html");
        el.innerHTML =
            "<html><head><title>titleTest</title></head><body>" +
            table +
            "</body></html>";
        XLSX.utils.html.save_table_as_excel(el.getElementsByTagName("Table")[0], {
            name: excelName
        });
    },
    onlyImgValidators: function (file) {
        let valid = false;
        var _validFileExtensions = [".jpg", ".jpeg", ".bmp", ".gif", ".png"];
        for (let i = 0; i < file.length; i++) {
            for (var j = 0; j < _validFileExtensions.length; j++) {
                if (file[i].name.lastIndexOf(_validFileExtensions[j]) == -1) {
                    return false;
                } else {
                    return true;
                }
            }
        }
    },
    validateemail: function (email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    },
    getAge: function (d1, d2) {
        d2 = d2 || new Date();
        var diff = d2.getTime() - d1.getTime();
        return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    },
    parseJwt: function (token) {
        var base64Url = token.split(".")[1];
        var base64 = decodeURIComponent(
            atob(base64Url)
                .split("")
                .map(function (c) {
                    return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join("")
        );

        return JSON.parse(base64);
    },
    b64EncodeUnicode: function (str) {
        return btoa(
            encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function toSolidBytes(
                match,
                p1
            ) {
                return String.fromCharCode("0x" + p1);
            })
        );
    },

    b64DecodeUnicode: function (str) {
        return decodeURIComponent(
            atob(str)
                .split("")
                .map(function (c) {
                    return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join("")
        );
    },
    urlParse: function (value, type) {
        var dizi = [];
        var param = value.split("&");
        param.forEach(function (row, index) {
            if (row.indexOf("=") > 0) {
                var value = row.split("=");

                dizi.push({
                    PropertyName: value[0],
                    Operation: value[1].split(",").length > 1 ? "IN" : "EQ",
                    PropertyValue: value[1]
                });
            } else if (row.indexOf("<") > 0) {
                var value = row.split("<");
                dizi.push({
                    PropertyName: value[0],
                    Operation: "LT",
                    PropertyValue: value[1]
                });
            } else if (row.indexOf(">") > 0) {
                var value = row.split(">");
                dizi.push({
                    PropertyName: value[0],
                    Operation: "GT",
                    PropertyValue: value[1]
                });
            } else if (row.indexOf("%") > 0) {
                var value = row.split("%");
                dizi.push({
                    PropertyName: value[0],
                    Operation: "CT",
                    PropertyValue: value[1]
                });
            } else if (row.indexOf("-") > 0) {
                var value = row.split("-");
                dizi.push({
                    PropertyName: value[0],
                    Operation: "NE",
                    PropertyValue: value[1]
                });
            } else if (row.indexOf("!") > 0) {
                var value = row.split("!");
                if (type == "N") {
                    value[1] = parseFloat(value[1]);
                }
            }
        });
        return dizi;
    },
    readFileToBase64: function (file) {
        return new Promise(function (resolve, reject) {
            var reader = new FileReader();
            reader.onload = function (e) {
                var binaryFile = "";
                var base64File;
                if (typeof reader.readAsBinaryString === "undefined") {
                    var bytes = new Uint8Array(e.target.result);
                    for (var i = 0; i < bytes.byteLength; i++) {
                        binaryFile += String.fromCharCode(bytes[i]);
                    }
                    base64File = btoa(binaryFile);
                } else {
                    base64File = btoa(e.target.result);
                }
                var data = {
                    name: file.name,
                    type: file.type != null ? file.type : file.name.split(".").pop(),
                    size: file.size.toString(),
                    base64: base64File
                };
                resolve(data);
            };
            if (typeof reader.readAsBinaryString !== "undefined") {
                reader.readAsBinaryString(file);
            } else {
                reader.readAsArrayBuffer(file);
            }
        });
    }
};
export default appPlugin;
