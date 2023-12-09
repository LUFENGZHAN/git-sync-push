# gitSyncPush
> 指定当前目录下的文件目录复制到指定目录中

### **Install**
```
npm install  git-sync-push -g
```
# 使用说明
第一种方式
运行脚本 
```
终端输入 git-sync-push 或 gitsyncpush
```
第一步：请选择需要推送的文件默认: dist文件目录
```
列如:输入src 会迁移目录中的所以文件
```
第二步：请输入要放入文件的绝对
```
例如:C:\user\Desktop\uitls\index
最后一项index作为目录名称创建
确认好目录中无重要文件，否则会把该目录下的文件全部删除  默认: C盘下的dist目录
```
第三步：输入远程仓库名称
```
有提示目标文件有几个远程名 默认origin
```
第四步：是否使用当前分支进行同步并推送，

第二种方式
```
终端输入 git-sync-push 或 gitsyncpush 加地址 只需输入提交信息可直接推送
如: gitsyncpush C:/dist 即可