#! /usr/bin/env node

const inquirer = require("inquirer");
const simpleGit = require("simple-git");
const fs = require("fs");
const chalk = require("chalk");
const path = require("path");
const workingDir = process.cwd();

// default value
let branchesList = [];
let currentBranch = "";
let file_name = "";
let answers_file = "";
let commit = "";
let origin_name = "";
let index_value = 0;
let value_index = 0;
let data_origin;
let def_val = false;

async function main() {
    try {
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
                    message: "请输入要放入文件的绝对路径",
                    name: "url",
                    default: "C:\\dist",
                    validate: function (val) {
                        const done = this.async();
                        const reg = new RegExp(/([a-zA-Z]:(([\\\\/])[^\\\\/:*?<>|]+)*([\\\\/])[^\\\\/:*?<>|]+\\.[^\\\\/:*?<>|]+,)*[a-zA-Z]:(([\\\\/])[^\\\\/:*?<>|]+)*([\\\\/])[^\\\\/:*?<>|]+\\.[^\\\\/:*?<>|]+(\\?)$/g);
                        if (reg.test(val)) {
                            done(null, true);
                        }
                        done("请输入要放入文件的绝对路径如:C:\\Users\\Destop\\index");
                    },
                },
            ])
            .then((answers) => {
                const {file_url, url} = answers;
                file_name = file_url;
                answers_file = url;
            });
        if (!fs.existsSync(file_name)) return console.log(chalk.red(`未发现${file_name}目录`));
        copyFolderSync_index(file_name, answers_file);
        const list = fs.readdirSync(file_name);
        if (list.length === 0) return console.log(chalk.red(`${file_name}目录为空`));

        await existsSyncFn();

        const git = simpleGit(answers_file);
        await git
            .status()
            .then(() => {})
            .catch(async () => {
                console.log(chalk.red("该目录及父级目录中不存在.git"));
                await inquirer
                    .prompt([
                        {
                            type: "confirm",
                            name: "choice",
                            message: `目标目录不属于.git仓库是否继续复制文件`,
                            default: false,
                        },
                    ])
                    .then((answers) => {
                        const {choice} = answers;
                        if (choice) {
                            copyFolderSync(file_name, answers_file);
                        }
                    });
                process.exit();
            });
        await git.branch((error, result) => {
            if (error) console.error(error);
            else currentBranch = result.current;
        });

        await git.listRemote(["--refs"], async (err, data) => {
            if (err) {
                console.error(err, "err");
                return;
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
                return;
            }
            data_origin = data.map((v) => v.name);
            console.log(chalk.green("存在的远程仓库有", data_origin));
        });
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
                const {originName} = answers;
                origin_name = originName;
            });
        await inquirer
            .prompt([
                {
                    type: "confirm",
                    name: "choice",
                    message: `请是否使用当前分支${currentBranch}分支进行同步并推送`,
                    default: false,
                },
            ])
            .then((answers) => {
                def_val = answers.choice;
            });
        if (def_val) {
            await inquirer
                .prompt([
                    {
                        type: "list",
                        name: "choice",
                        message: "请选择需要推送的分支：",
                        default: 0,
                        choices: branchesList.map((v) => {
                            return {name: v, value: v};
                        }),
                    },
                ])
                .then((answers) => {
                    currentBranch = answers.choice;
                });
        }
        await git.checkout(currentBranch).then(() => {
            console.log(chalk.green(`成功拉取${origin_name}分支代码至${origin_name}`));
            return git.pull(origin_name, currentBranch);
        });
        await new Promise((resolve) => {
            fs.exists(file_name, async (directory) => {
                if (!directory) return console.log("未找到目录");
                fs.exists(answers_file, (is_hide) => {
                    if (is_hide) {
                        resolvefile(resolve);
                    } else {
                        fs.mkdir(answers_file, (err) => {
                            if (err) return console.log("错误" + err);
                            resolvefile(resolve);
                        });
                    }
                });
            });
        });
        await new Promise((resolve) => {
            copyFolderSync(file_name, answers_file);
            if (index_value === value_index) resolve("");
            else console.log(chalk.red("创建失败"));
        });
        Gitpush();
        async function Gitpush() {
            await inquirer
                .prompt([
                    {
                        type: "input",
                        message: "请输入提交消息",
                        name: "commit",
                        default: "[mod] init",
                    },
                ])
                .then((answers) => {
                    commit = answers.commit;
                });
            await git
                .add("./*")
                .then(() => {
                    console.log(chalk.green("添加成功"));
                })
                .catch(() => {
                    console.log(chalk.red("添加失败"));
                });
            await git
                .commit(commit)
                .then(() => {
                    console.log(chalk.green("提交成功"));
                })
                .catch(() => {
                    console.log(chalk.red("提交失败"));
                });

            await git
                .push(["-f", "-u", origin_name, currentBranch])
                .then(() => {
                    console.log(chalk.green("推送成功"));
                })
                .catch(() => {
                    console.log(chalk.red("推送失败"));
                });
        }
    } catch (error) {
        console.log("error" + error);
    }
}
async function existsSyncFn() {
    let arr = answers_file.split("\\");
    let arr_new = [];
    let len = arr.length;
    while (len !== 0) {
        if (len !== arr.length) {
            var reg = new RegExp("\\\\" + arr[len], "gi");
            let newstr = answers_file.split(reg)[0];
            arr_new.unshift(newstr);
        } else {
            arr_new.push(answers_file);
        }
        len--;
    }
    arr_new = await arr_new.filter((v, i, arrs) => arrs.indexOf(v) === i);
    if (arr.length !== arr_new.length) {
        console.log(chalk.red(`创建失败`));
        return process.exit();
    }
    await arr_new.forEach(async (v, i, arr) => {
        if (!fs.existsSync(v)) {
            await fs.mkdirSync(v);
            console.log(chalk.green(`成功创建${v}目录`));
        }
    });
}
function resolvefile(resolve) {
    const list = fs.readdirSync(answers_file);
    if (list.length === 0) return resolve("");
    list.forEach((file, index, arr) => {
        const sourcePath = path.join(answers_file, file);
        fs.rm(sourcePath, {recursive: true}, (err) => {
            if (err) {
                console.log(chalk.red(err));
                return process.exit();
            }
            console.log("删除原有文件", file);
            if (index === arr.length - 1) return resolve("");
        });
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
            console.log(`生成新文件${file}=====` + "(" + `${value_index}/` + chalk.green(index_value) + ")");
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
main();
