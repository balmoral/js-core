### Common JS

When we figure out how to package ES6 we will...

### Github

Requires fiddling around with SSL on Mac, etc to allow for both balmoral and bakeworks to access their different accounts.

Some links which explain how to do this: 
* [Handling Multiple Github Accounts on MacOS](https://gist.github.com/Jonalogy/54091c98946cfe4f8cdab2bea79430f9)

`.git/config`

```
[user]
        name = b__m___l
        email = c__@m___e__.com
[core]
        repositoryformatversion = 0
        filemode = true
        bare = false
        logallrefupdates = true
        ignorecase = true
        sshCommand = ssh -i ~/.ssh/bakeworks
[remote "origin"]
        url = git@github.com:balmoral/js-core.git
        fetch = +refs/heads/*:refs/remotes/origin/*
[branch "main"]
        remote = origin
        merge = refs/heads/master
```

