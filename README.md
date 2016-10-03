![alt tag](https://cdn.discordapp.com/attachments/231497949006266369/232176166587334656/full-01.png)
# D-Lock-Client
**Winner of SD Hacks 2016 Data Privacy Hack Award**

With growing technologies such as Ceph by Red Hat and the Hadoop Distributed File System, the idea of distributing files over multiple hardware devices has garnered a strong following in recent years. We wanted to spread this rapid expansion with everyday consumers. We hoped to give users a secure and redundant way of managing private files.

D-Loc allows users to spread their files over multiple devices, increasing file access security. D-Loc spreads out files over a multitude of the user's devices, giving each device a small, encrypted section of the file. Only when all devices join the same network, and log in to the user account, are the pieces able to be put back together, and the original file retrieved.

## Dev Instructions
```bash
git clone https://github.com/D-Lock/D-Lock-Client
cd D-Lock-Client
npm install
bower install
jspm install
npm start
```

Client requires a Firebase configuration in `dist/app/config.js`, and a [Routing Server](https://github.com/D-Lock/Routing-Server).
