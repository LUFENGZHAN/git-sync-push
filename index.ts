#! /usr/bin/env node
const inquirer = require("inquirer");
const simpleGit = require("simple-git");
const fs = require("fs");
const chalk = require("chalk");
const path = require("path");
const workingDir = process.cwd();
const requiredVersion = "14.16.1"

// default value
let branchesList = [];
let currentBranch = "";
let file_name = "dist";
let target_url = "";
let commit = "";
let origin_name = "";
let remote_name = "";
let remote_url = "";
let remote_branch = "";
let index_value = 0;
let value_index = 0;
let target_index = 0;
let target_len = 0;
let data_origin;
let def_val = false;
let git;
const regpath = new RegExp(/([a-zA-Z]:(([\\\\/])[^\\\\/:*?<>|]+)*([\\\\/])[^\\\\/:*?<>|]+\\.[^\\\\/:*?<>|]+,)*[a-zA-Z]:(([\\\\/])[^\\\\/:*?<>|]+)*([\\\\/])[^\\\\/:*?<>|]+\\.[^\\\\/:*?<>|]+(\\?)*$/g);
const reg_one = new RegExp(/^([a-zA-Z]:)(\\[^/\\:*?"<>|]+\\?)*$/g);
const argv = process.argv[2]
if (parseFloat(process.versions.node) < parseFloat(requiredVersion)) {
    console.error(`需要 Node.js 版本 ${requiredVersion} 或更高版本来运行此脚本`);
    process.exit(1);
} else {
    if (argv) {
        if (regpath.test(argv) || reg_one.test(argv)) {
            target_url = argv
            main(false)
        } else {
            console.log(chalk.red(`请输入正确的地址如:C:\\index`))
        }
    } else {
        main(true)
    }
}
async function main(is_argv = true) {
    try {
        if (is_argv) {
            console.log(chalk.green("使用 shift + ins 键实现粘贴内容"));
            await inquirer
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
                            const done = this.async();
                            if (regpath.test(val) || reg_one.test(val)) {
                                done(null, true);
                            }
                            done("请输入目标文件的绝对路径如:C:\\index\\dad");
                        },
                    }
                ])
                .then((answers) => {
                    const { file_url, url } = answers;
                    file_name = file_url;
                    target_url = url;
                });
        }

        if (!fs.existsSync(file_name)) return console.log(chalk.red(`未发现${file_name}目录`));
        const list = fs.readdirSync(file_name);
        copyFolderSync_index(file_name, target_url);
        await count_length();
        if (list.length === 0) return console.log(chalk.red(`${file_name}目录为空`));
        await existsSyncFn();
        git = simpleGit(target_url);
        await git
            .status()
            .then(() => { })
            .catch(async () => {
                console.log(chalk.red("该目录不属于.git仓库"));
                await inquirer
                    .prompt([
                        {
                            type: "confirm",
                            name: "choice",
                            message: `该目录不属于.git仓库是否继续复制文件`,
                            default: false,
                        },
                    ])
                    .then(async (answers) => {
                        const { choice } = answers;
                        if (choice) {
                            copyFolderSync(file_name, target_url);
                            if (index_value === value_index) return process.exit(1)
                        } else {
                            process.exit(1);
                        }
                    });
            });
        await git.branch((error, result) => {
            if (error) console.error(error);
            else currentBranch = result.current;
        });

        await git.listRemote(["--refs"], async (err, data) => {
            if (err) {
                console.error(err, "err");
                process.exit(1);
            }
            // 解析输出并获取分支列表
            branchesList = data
                .split("\n")
                .filter((branch) => branch.includes("refs/heads"))
                .map((branch) => branch.split("refs/heads/")[1]);
        });
        await git.getRemotes(async (err, data) => {
            if (err) {
                console.error(err, "err");
                process.exit(1);
            }
            data_origin = data.map((v) => v.name);
            console.log(chalk.green("已存在的远程仓库有", data_origin));
        });
        if (is_argv) {
            await inquirer
                .prompt([
                    {
                        type: "input",
                        message: "请输入远程仓库名称",
                        name: "originName",
                        default: "origin",
                        validate: function (val) {
                            const done = this.async();
                            if (data_origin.includes(val)) {
                                done(null, true);
                            }
                            done("请输入存在的远程仓库");
                        },
                    },
                ])
                .then((answers) => {
                    const { originName } = answers;
                    origin_name = originName;
                });
            if (currentBranch) {
                await inquirer
                    .prompt([
                        {
                            type: "confirm",
                            name: "choice",
                            message: `是否使用当前${currentBranch}分支进行同步并推送`,
                            default: true,
                        },
                    ])
                    .then((answers) => {
                        def_val = answers.choice;
                    });
            } else {
                def_val = false;
            }
            if (!def_val) {
                await inquirer
                    .prompt([
                        {
                            type: "list",
                            name: "choice",
                            message: "请选择需要推送的分支：",
                            default: 0,
                            choices: branchesList.map((v) => {
                                return { name: v, value: v };
                            }),
                        },
                    ])
                    .then((answers) => {
                        currentBranch = answers.choice;
                    });
            }
        } else {
            origin_name = data_origin[0]
        }
        await git.checkout(currentBranch).then(() => {
            console.log(chalk.green(`已成功拉取${origin_name}远程仓库代码至${origin_name}本地仓库`));
            return git.pull(origin_name, currentBranch);
        });
        await count_length();
        let temporary;
        new Promise(async (resolve, rej) => {
            await resolvefile();
            temporary = setInterval(() => {
                if (target_index === target_len) {
                    console.log(`${target_index}个文件/目录${chalk.green("已全部删除")}`);
                    return resolve("");
                }
            }, 500);
        })
            .then(() => {
                clearInterval(temporary);
                new Promise(async (resolve) => {
                    copyFolderSync(file_name, target_url);
                    if (index_value === value_index) return resolve("");
                }).then(() => {
                    Gitpush();
                });
            })
            .catch(() => {
                clearInterval(temporary);
                Gitpush();
            });
    } catch (error) {
        console.log("error" + error);
    }
}

function continuous(params) {
    return setInterval(() => {
        console.log(chalk.yellow(params));
    }, 500);
}

async function existsSyncFn() {
    let arr = target_url.split("\\");
    let arr_new = [];
    let len = arr.length;
    while (len !== 0) {
        if (len !== arr.length) {
            var reg = new RegExp("\\\\" + arr[len], "gi");
            let newstr = target_url.split(reg)[0];
            arr_new.unshift(newstr);
        } else {
            arr_new.push(target_url);
        }
        len--;
    }
    arr = await arr.filter((e) => e);
    arr_new = await arr_new.filter((v, i, arrs) => arrs.indexOf(v) === i);
    if (arr.length !== arr_new.length) {
        console.log(chalk.red(`创建失败`));
        return process.exit(1);
    }
    await arr_new.forEach(async (v, i, arr) => {
        if (!fs.existsSync(v)) {
            await fs.mkdirSync(v);
            console.log(chalk.green(`成功创建${v}目录`));
        }
    });
}
function resolvefile() {
    const resolvefilelist = fs.readdirSync(target_url);
    resolvefilelist.forEach((file) => {
        const sourcePath = path.join(target_url, file);
        if (file !== ".git") {
            fs.rm(sourcePath, { recursive: true }, (err) => {
                if (err) {
                    console.log(chalk.red(err));
                    return process.exit(1);
                }
                target_index++;
                console.log(`删除原有文${chalk.yellow(file)}——————${target_index}/${chalk.green(target_len)}`);
            });
        }
    });
}
function copyFolderSync(source, target) {
    if (!fs.existsSync(target)) {
        fs.mkdirSync(target);
    }
    fs.readdirSync(source).forEach((file) => {
        const sourcePath = path.join(source, file);
        const targetPath = path.join(target, file);
        if (fs.lstatSync(sourcePath).isDirectory()) {
            copyFolderSync(sourcePath, targetPath);
        } else {
            value_index++;
            fs.copyFileSync(sourcePath, targetPath);
            console.log(`生成新文件${file}——————————` + "(" + `${value_index}/` + chalk.green(index_value) + ")");
        }
    });
}

function copyFolderSync_index(source, target) {
    fs.readdirSync(source).forEach((file) => {
        const sourcePath = path.join(source, file);
        const targetPath = path.join(target, file);
        if (fs.lstatSync(sourcePath).isDirectory()) {
            copyFolderSync_index(sourcePath, targetPath);
        } else {
            index_value++;
        }
    });
}
async function count_length() {
    if (fs.existsSync(target_url)) {
        target_len = 0;
        const target_list = fs.readdirSync(target_url);
        if (target_list) {
            target_list.forEach((value, i) => {
                if (value !== ".git") {
                    target_len++;
                }
            });
        }
    }
}
async function Gitpush() {
    await inquirer
        .prompt([
            {
                type: "input",
                message: "请输入提交消息",
                name: "commit",
                default: "[mod] update page",
            },
        ])
        .then((answers) => {
            commit = answers.commit;
        });
    const start_continuous = continuous("正在添加中...");

    await git
        .add("./*")
        .then(() => {
            clearInterval(start_continuous);
            console.log(chalk.green("添加成功"));
        })
        .catch(() => {
            clearInterval(start_continuous);
            console.log(chalk.red("添加失败"));
            process.exit(1);
        });
    const war_continuous = continuous("正在提交中...");
    await git
        .commit(commit)
        .then(() => {
            clearInterval(war_continuous);
            console.log(chalk.green("提交成功"));
        })
        .catch(() => {
            clearInterval(war_continuous);
            console.log(chalk.red("提交失败"));
            process.exit(1);
        });
    const success = continuous("正在推送中...");
    await git
        .push(origin_name, currentBranch)
        .then(() => {
            clearInterval(success);
            console.log(chalk.green("推送成功"));
        })
        .catch(() => {
            clearInterval(success);
            console.log(chalk.yellow("推送失败"));
            process.exit(1);
        });
}
