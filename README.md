### Common JS

When we figure out how to package ES6 we will...

### Github

Given there's a single universal github setting on Mac OSX,
we have to edit `./git/config` to specify different github accounts.

#### References

* [Handling Multiple Github Accounts on MacOS](https://gist.github.com/Jonalogy/54091c98946cfe4f8cdab2bea79430f9)

#### Example

`.git/config`

```
[user]
        name = xx
        email = xx
[core]
        repositoryformatversion = 0
        filemode = true
        bare = false
        logallrefupdates = true
        ignorecase = true
        sshCommand = ssh -i ~/.ssh/balmoral
[remote "origin"]
        url = git@github.com:balmoral/js-core.git
        fetch = +refs/heads/*:refs/remotes/origin/*
[branch "main"]
        remote = origin
        merge = refs/heads/master
```

