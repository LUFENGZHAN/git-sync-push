#! /usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var inquirer = require("inquirer");
var simpleGit = require("simple-git");
var fs = require("fs");
var chalk = require("chalk");
var path = require("path");
var workingDir = process.cwd();
var requiredVersion = "14.16.1";
// default value
var branchesList = [];
var currentBranch = "";
var file_name = "dist";
var target_url = "";
var commit = "";
var origin_name = "";
var remote_name = "";
var remote_url = "";
var remote_branch = "";
var index_value = 0;
var value_index = 0;
var target_index = 0;
var target_len = 0;
var data_origin;
var def_val = false;
var git;
var regpath = new RegExp(/([a-zA-Z]:(([\\\\/])[^\\\\/:*?<>|]+)*([\\\\/])[^\\\\/:*?<>|]+\\.[^\\\\/:*?<>|]+,)*[a-zA-Z]:(([\\\\/])[^\\\\/:*?<>|]+)*([\\\\/])[^\\\\/:*?<>|]+\\.[^\\\\/:*?<>|]+(\\?)*$/g);
var reg_one = new RegExp(/^([a-zA-Z]:)(\\[^/\\:*?"<>|]+\\?)*$/g);
var argv = process.argv[2];
if (parseFloat(process.versions.node) < parseFloat(requiredVersion)) {
    console.error("\u9700\u8981 Node.js \u7248\u672C ".concat(requiredVersion, " \u6216\u66F4\u9AD8\u7248\u672C\u6765\u8FD0\u884C\u6B64\u811A\u672C"));
    process.exit(1);
}
else {
    if (argv) {
        if (regpath.test(argv) || reg_one.test(argv)) {
            target_url = argv;
            main(false);
        }
        else {
            console.log(chalk.red("\u8BF7\u8F93\u5165\u6B63\u786E\u7684\u5730\u5740\u5982:C:\\index"));
        }
    }
    else {
        main(true);
    }
}
function main(is_argv) {
    if (is_argv === void 0) { is_argv = true; }
    return __awaiter(this, void 0, void 0, function () {
        var list, temporary_1, error_1;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 19, , 20]);
                    if (!is_argv) return [3 /*break*/, 2];
                    console.log(chalk.green("使用 shift + ins 键实现粘贴内容"));
                    return [4 /*yield*/, inquirer
                            .prompt([
                            {
                                type: "input",
                                message: "请选择需要发布的文件",
                                name: "file_url",
                                default: "dist",
                            },
                            {
                                type: "input",
                                message: "请输入目标文件的绝对路径",
                                name: "url",
                                default: "C:\\dist",
                                validate: function (val) {
                                    var done = this.async();
                                    if (regpath.test(val) || reg_one.test(val)) {
                                        done(null, true);
                                    }
                                    done("请输入目标文件的绝对路径如:C:\\index\\dad");
                                },
                            }
                        ])
                            .then(function (answers) {
                            var file_url = answers.file_url, url = answers.url;
                            file_name = file_url;
                            target_url = url;
                        })];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    if (!fs.existsSync(file_name))
                        return [2 /*return*/, console.log(chalk.red("\u672A\u53D1\u73B0".concat(file_name, "\u76EE\u5F55")))];
                    list = fs.readdirSync(file_name);
                    copyFolderSync_index(file_name, target_url);
                    return [4 /*yield*/, count_length()];
                case 3:
                    _a.sent();
                    if (list.length === 0)
                        return [2 /*return*/, console.log(chalk.red("".concat(file_name, "\u76EE\u5F55\u4E3A\u7A7A")))];
                    return [4 /*yield*/, existsSyncFn()];
                case 4:
                    _a.sent();
                    git = simpleGit(target_url);
                    return [4 /*yield*/, git
                            .status()
                            .then(function () { })
                            .catch(function () { return __awaiter(_this, void 0, void 0, function () {
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        console.log(chalk.red("该目录不属于.git仓库"));
                                        return [4 /*yield*/, inquirer
                                                .prompt([
                                                {
                                                    type: "confirm",
                                                    name: "choice",
                                                    message: "\u8BE5\u76EE\u5F55\u4E0D\u5C5E\u4E8E.git\u4ED3\u5E93\u662F\u5426\u7EE7\u7EED\u590D\u5236\u6587\u4EF6",
                                                    default: false,
                                                },
                                            ])
                                                .then(function (answers) { return __awaiter(_this, void 0, void 0, function () {
                                                var choice;
                                                return __generator(this, function (_a) {
                                                    choice = answers.choice;
                                                    if (choice) {
                                                        copyFolderSync(file_name, target_url);
                                                    }
                                                    else {
                                                        process.exit(1);
                                                    }
                                                    return [2 /*return*/];
                                                });
                                            }); })];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, git.branch(function (error, result) {
                            if (error)
                                console.error(error);
                            else
                                currentBranch = result.current;
                        })];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, git.listRemote(["--refs"], function (err, data) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                if (err) {
                                    console.error(err, "err");
                                    process.exit(1);
                                }
                                // 解析输出并获取分支列表
                                branchesList = data
                                    .split("\n")
                                    .filter(function (branch) { return branch.includes("refs/heads"); })
                                    .map(function (branch) { return branch.split("refs/heads/")[1]; });
                                return [2 /*return*/];
                            });
                        }); })];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, git.getRemotes(function (err, data) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                if (err) {
                                    console.error(err, "err");
                                    process.exit(1);
                                }
                                data_origin = data.map(function (v) { return v.name; });
                                console.log(chalk.green("已存在的远程仓库有", data_origin));
                                return [2 /*return*/];
                            });
                        }); })];
                case 8:
                    _a.sent();
                    if (!is_argv) return [3 /*break*/, 15];
                    return [4 /*yield*/, inquirer
                            .prompt([
                            {
                                type: "input",
                                message: "请输入远程仓库名称",
                                name: "originName",
                                default: "origin",
                                validate: function (val) {
                                    var done = this.async();
                                    if (data_origin.includes(val)) {
                                        done(null, true);
                                    }
                                    done("请输入存在的远程仓库");
                                },
                            },
                        ])
                            .then(function (answers) {
                            var originName = answers.originName;
                            origin_name = originName;
                        })];
                case 9:
                    _a.sent();
                    if (!currentBranch) return [3 /*break*/, 11];
                    return [4 /*yield*/, inquirer
                            .prompt([
                            {
                                type: "confirm",
                                name: "choice",
                                message: "\u662F\u5426\u4F7F\u7528\u5F53\u524D".concat(currentBranch, "\u5206\u652F\u8FDB\u884C\u540C\u6B65\u5E76\u63A8\u9001"),
                                default: true,
                            },
                        ])
                            .then(function (answers) {
                            def_val = answers.choice;
                        })];
                case 10:
                    _a.sent();
                    return [3 /*break*/, 12];
                case 11:
                    def_val = false;
                    _a.label = 12;
                case 12:
                    if (!!def_val) return [3 /*break*/, 14];
                    return [4 /*yield*/, inquirer
                            .prompt([
                            {
                                type: "list",
                                name: "choice",
                                message: "请选择需要推送的分支：",
                                default: 0,
                                choices: branchesList.map(function (v) {
                                    return { name: v, value: v };
                                }),
                            },
                        ])
                            .then(function (answers) {
                            currentBranch = answers.choice;
                        })];
                case 13:
                    _a.sent();
                    _a.label = 14;
                case 14: return [3 /*break*/, 16];
                case 15:
                    origin_name = data_origin[0];
                    _a.label = 16;
                case 16: return [4 /*yield*/, git.checkout(currentBranch).then(function () {
                        console.log(chalk.green("\u5DF2\u6210\u529F\u62C9\u53D6".concat(origin_name, "\u8FDC\u7A0B\u4ED3\u5E93\u4EE3\u7801\u81F3").concat(origin_name, "\u672C\u5730\u4ED3\u5E93")));
                        return git.pull(origin_name, currentBranch);
                    })];
                case 17:
                    _a.sent();
                    return [4 /*yield*/, count_length()];
                case 18:
                    _a.sent();
                    new Promise(function (resolve, rej) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, resolvefile()];
                                case 1:
                                    _a.sent();
                                    temporary_1 = setInterval(function () {
                                        if (target_index === target_len) {
                                            console.log("".concat(target_index, "\u4E2A\u6587\u4EF6/\u76EE\u5F55").concat(chalk.green("已全部删除")));
                                            return resolve("");
                                        }
                                    }, 500);
                                    return [2 /*return*/];
                            }
                        });
                    }); })
                        .then(function () {
                        clearInterval(temporary_1);
                        new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, copyFolderSync(file_name, target_url)];
                                    case 1:
                                        _a.sent();
                                        if (index_value === value_index)
                                            return [2 /*return*/, resolve("")];
                                        return [2 /*return*/];
                                }
                            });
                        }); }).then(function () {
                            Gitpush();
                        });
                    })
                        .catch(function () {
                        clearInterval(temporary_1);
                        Gitpush();
                    });
                    return [3 /*break*/, 20];
                case 19:
                    error_1 = _a.sent();
                    console.log("error" + error_1);
                    return [3 /*break*/, 20];
                case 20: return [2 /*return*/];
            }
        });
    });
}
function continuous(params) {
    return setInterval(function () {
        console.log(chalk.yellow(params));
    }, 500);
}
function existsSyncFn() {
    return __awaiter(this, void 0, void 0, function () {
        var arr, arr_new, len, reg, newstr;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    arr = target_url.split("\\");
                    arr_new = [];
                    len = arr.length;
                    while (len !== 0) {
                        if (len !== arr.length) {
                            reg = new RegExp("\\\\" + arr[len], "gi");
                            newstr = target_url.split(reg)[0];
                            arr_new.unshift(newstr);
                        }
                        else {
                            arr_new.push(target_url);
                        }
                        len--;
                    }
                    return [4 /*yield*/, arr.filter(function (e) { return e; })];
                case 1:
                    arr = _a.sent();
                    return [4 /*yield*/, arr_new.filter(function (v, i, arrs) { return arrs.indexOf(v) === i; })];
                case 2:
                    arr_new = _a.sent();
                    if (arr.length !== arr_new.length) {
                        console.log(chalk.red("\u521B\u5EFA\u5931\u8D25"));
                        return [2 /*return*/, process.exit(1)];
                    }
                    return [4 /*yield*/, arr_new.forEach(function (v, i, arr) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!!fs.existsSync(v)) return [3 /*break*/, 2];
                                        return [4 /*yield*/, fs.mkdirSync(v)];
                                    case 1:
                                        _a.sent();
                                        console.log(chalk.green("\u6210\u529F\u521B\u5EFA".concat(v, "\u76EE\u5F55")));
                                        _a.label = 2;
                                    case 2: return [2 /*return*/];
                                }
                            });
                        }); })];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function resolvefile() {
    var resolvefilelist = fs.readdirSync(target_url);
    resolvefilelist.forEach(function (file) {
        var sourcePath = path.join(target_url, file);
        if (file !== ".git") {
            fs.rm(sourcePath, { recursive: true }, function (err) {
                if (err) {
                    console.log(chalk.red(err));
                    return process.exit(1);
                }
                target_index++;
                console.log("\u5220\u9664\u539F\u6709\u6587".concat(chalk.yellow(file), "\u2014\u2014\u2014\u2014\u2014\u2014").concat(target_index, "/").concat(chalk.green(target_len)));
            });
        }
    });
}
function copyFolderSync(source, target) {
    if (!fs.existsSync(target)) {
        fs.mkdirSync(target);
    }
    fs.readdirSync(source).forEach(function (file) {
        var sourcePath = path.join(source, file);
        var targetPath = path.join(target, file);
        if (fs.lstatSync(sourcePath).isDirectory()) {
            copyFolderSync(sourcePath, targetPath);
        }
        else {
            value_index++;
            fs.copyFileSync(sourcePath, targetPath);
            console.log("\u751F\u6210\u65B0\u6587\u4EF6".concat(file, "\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014") + "(" + "".concat(value_index, "/") + chalk.green(index_value) + ")");
        }
    });
}
function copyFolderSync_index(source, target) {
    fs.readdirSync(source).forEach(function (file) {
        var sourcePath = path.join(source, file);
        var targetPath = path.join(target, file);
        if (fs.lstatSync(sourcePath).isDirectory()) {
            copyFolderSync_index(sourcePath, targetPath);
        }
        else {
            index_value++;
        }
    });
}
function count_length() {
    return __awaiter(this, void 0, void 0, function () {
        var target_list;
        return __generator(this, function (_a) {
            if (fs.existsSync(target_url)) {
                target_len = 0;
                target_list = fs.readdirSync(target_url);
                if (target_list) {
                    target_list.forEach(function (value, i) {
                        if (value !== ".git") {
                            target_len++;
                        }
                    });
                }
            }
            return [2 /*return*/];
        });
    });
}
function Gitpush() {
    return __awaiter(this, void 0, void 0, function () {
        var start_continuous, war_continuous, success;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, inquirer
                        .prompt([
                        {
                            type: "input",
                            message: "请输入提交消息",
                            name: "commit",
                            default: "[mod] update page",
                        },
                    ])
                        .then(function (answers) {
                        commit = answers.commit;
                    })];
                case 1:
                    _a.sent();
                    start_continuous = continuous("正在添加中...");
                    return [4 /*yield*/, git
                            .add("./*")
                            .then(function () {
                            clearInterval(start_continuous);
                            console.log(chalk.green("添加成功"));
                        })
                            .catch(function () {
                            clearInterval(start_continuous);
                            console.log(chalk.red("添加失败"));
                            process.exit(1);
                        })];
                case 2:
                    _a.sent();
                    war_continuous = continuous("正在提交中...");
                    return [4 /*yield*/, git
                            .commit(commit)
                            .then(function () {
                            clearInterval(war_continuous);
                            console.log(chalk.green("提交成功"));
                        })
                            .catch(function () {
                            clearInterval(war_continuous);
                            console.log(chalk.red("提交失败"));
                            process.exit(1);
                        })];
                case 3:
                    _a.sent();
                    success = continuous("正在推送中...");
                    return [4 /*yield*/, git
                            .push(origin_name, currentBranch)
                            .then(function () {
                            clearInterval(success);
                            console.log(chalk.green("推送成功"));
                        })
                            .catch(function () {
                            clearInterval(success);
                            console.log(chalk.yellow("推送失败"));
                            process.exit(1);
                        })];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
