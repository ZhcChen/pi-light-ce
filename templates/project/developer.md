# 开发参考

## Git 提交与推送

- 默认直接在当前主分支开发；除非用户明确要求，不额外创建功能分支。
- 每完成一个小功能块、小修复或一个最小可解释闭环，默认立即提交并推送。
- 及时提交和推送的核心目的，是降低因机器崩溃、终端异常或本地环境损坏导致代码丢失的风险。
- 提交单位不是消息轮次，而是一个可以单独解释、单独回滚的小逻辑、小功能或小修复。
- 不要等到整个大任务全部结束后再一次性提交；应按小功能块持续提交。
- 开始改文件前，先执行 `git status --short` 查看工作区状态。
- 提交前至少执行 `git diff --check`、`git diff --cached --check`、`git diff --cached`。
- 只暂存本轮相关文件；默认不要直接使用 `git add .`。
- 提交信息默认使用简体中文，建议前缀：`feat:`、`fix:`、`docs:`、`test:`、`chore:`、`refactor:`。
- commit 成功后，默认立即执行 `git fetch origin`、`git rebase origin/main`、`git push origin main`，先同步远端，再完成推送。
- 如果 `git push` 因远端已有新提交而被拒绝，默认不要强推；先同步远端并完成 `rebase`，处理完再推送。
- 如果 `rebase` 过程中出现冲突，先解决冲突文件，再执行 `git add <file>` 和 `git rebase --continue`，完成后再 `git push origin main`。
- 如果工作区存在无关改动，不回滚、不顺手整理、不混入本轮提交。
