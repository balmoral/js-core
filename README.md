### Common JS

When we figure out how to package ES6 we will...

### Github

Given there's a single universal github setting per user on Mac OSX,
we have to edit `./git/config` to specify another github account.

Edit `./git/config` after `git init` and before further git commands.

#### References

* [Handling Multiple Github Accounts on MacOS](https://gist.github.com/Jonalogy/54091c98946cfe4f8cdab2bea79430f9)

#### Example

`.git/config`

```
[user]
        name = [user-name]
        email = [email-address]
[core]
        repositoryformatversion = 0
        filemode = true
        bare = false
        logallrefupdates = true
        ignorecase = true
        sshCommand = ssh -i ~/.ssh/balmoral
[remote "origin"]
        url = git@github.com:[account-name]/[repository-name].git
        fetch = +refs/heads/*:refs/remotes/origin/*
[branch "main"]
        remote = origin
        merge = refs/heads/master
```

