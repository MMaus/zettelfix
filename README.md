# News

2023 01 06: The project is alive, again. There is a major rewrite ongoing. This rewrite will most likely be a breaking change, that is, existing data will be discarded. Some of the major new features are:

- brand new shopping cart experience: multiple shops supported
- technical rewrite backend: Laravel (improved user management and security)
- technical rewrite frontend: removing leftovers from Jutebag (predecessor project), migration to vue3

2022 03 11: Sorry that this project is pausing for now...  
I just switched my attention to another project, which is ML (no github repo in the near future - just getting started).  
The current state of this project is far from finished, not even close to an alpha version. Despite being deployed at zettelfix.de and used regularly by me, I consider it still as experimental draft - my TODO list just for this project is overwhelming, and although I enjoy improving this, I also want to progress on my other projects - so this may become a dead end street.  
Sorry for this.

# Installation

## Configuring apache2

mod_rewrite needs to be enabled; consult the web to see how.

.htaccess files must be allowed to overwrite rules; consult the web to see how.
TODO: attach sample config

the .htaccess-file

COPY api/ into public/api at after npm build

Project name: joote.net
