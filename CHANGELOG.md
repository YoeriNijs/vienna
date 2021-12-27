# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.3](https://github.com/YoeriNijs/vienna/compare/0.2.3...0.2.3)

### Commits

- refactor(demo counter): cleanup counter component [`b604086`](https://github.com/YoeriNijs/vienna/commit/b604086242afd017845d6379f4b2fac754afb78a)

## [0.2.3](https://github.com/YoeriNijs/vienna/compare/0.2.2...0.2.3) - 2021-12-27

### Commits

- fix(renderer): fix multiple bugs in renderer [`4c49ff0`](https://github.com/YoeriNijs/vienna/commit/4c49ff0415393934de9406262f4064e233b7de10)

## [0.2.2](https://github.com/YoeriNijs/vienna/compare/0.2.1...0.2.2) - 2021-12-17

### Commits

- fix(renderer): remove observed attributes since it is causing performance issues [`0e72834`](https://github.com/YoeriNijs/vienna/commit/0e728341d7f643d5b8539f5f203a0c85f300b8f7)

## [0.2.1](https://github.com/YoeriNijs/vienna/compare/0.2.0...0.2.1) - 2021-12-17

### Commits

- fix(package.json): new release with latest bugfixes [`3c5694f`](https://github.com/YoeriNijs/vienna/commit/3c5694f3f03336b337a36c4705525f340391dca5)
- fix(renderer): call VDestroy inside renderer when web component is disconnected from the dom [`e4cbe50`](https://github.com/YoeriNijs/vienna/commit/e4cbe5059b776dc606c96ceddc113a2da23198d6)
- Replace double quotes by single quotes [`115aef0`](https://github.com/YoeriNijs/vienna/commit/115aef089435ff6ee302c1cc34a2861f8037d93d)

## [0.2.0](https://github.com/YoeriNijs/vienna/compare/0.1.4...0.2.0) - 2021-11-22

### Commits

- chore(package.json): release 0.2.0 [`e42b1b1`](https://github.com/YoeriNijs/vienna/commit/e42b1b12aa311e43be4255e43955869817a23b8e)
- feat(attribute mapping): support all dom events as attributes [`8291151`](https://github.com/YoeriNijs/vienna/commit/8291151b1582eba2af9bf2819073bafa9fd889a3)
- docs(changelog): update changelog [`ab032bc`](https://github.com/YoeriNijs/vienna/commit/ab032bcf751aac988f97235821c9ed78bfec62ee)
- fix(renderer): rerender only dirty elements [`9ae112f`](https://github.com/YoeriNijs/vienna/commit/9ae112fb183acb2709619d90793da8a8f29ce44a)

## [0.1.4](https://github.com/YoeriNijs/vienna/compare/0.1.2...0.1.4) - 2021-11-19

### Commits

- fix(v-application): destroy old setInterval and setTimeout functions when a rebuild is triggered [`6e3d542`](https://github.com/YoeriNijs/vienna/commit/6e3d5427301209412c306d5bdb606b86684335fb)
- docs(readme): fix some typo's [`9940fca`](https://github.com/YoeriNijs/vienna/commit/9940fcaf2bc4079c785fb5fd10bc58b720149144)
- fix(package.json): new release with updated docs [`b0007a6`](https://github.com/YoeriNijs/vienna/commit/b0007a6ec8389ed0e7209d32a5b5a93168ead7fc)

## [0.1.2](https://github.com/YoeriNijs/vienna/compare/0.1.1...0.1.2) - 2021-11-19

### Commits

- docs(readme): fix readme [`788b277`](https://github.com/YoeriNijs/vienna/commit/788b2770af0b7008a5b1dfde547203210e186b87)

## [0.1.1](https://github.com/YoeriNijs/vienna/compare/0.1.0...0.1.1) - 2021-11-19

### Commits

- docs(readme): fix readme format [`7bcb7e2`](https://github.com/YoeriNijs/vienna/commit/7bcb7e2c836162e8ba68f61df1e330380cc33a4b)

## 0.1.0 - 2021-11-19

### Commits

- docs(changelog): update changelog [`3a77d6c`](https://github.com/YoeriNijs/vienna/commit/3a77d6cf6b83c8419f9cfd3a3b9b9ba169b163d4)
- fix(release.sh): working on new release script, not tested yet [`ab2eb7b`](https://github.com/YoeriNijs/vienna/commit/ab2eb7b1fd677312e3eede700d5541f25308c703)
- docs(readme): update [`edfb38f`](https://github.com/YoeriNijs/vienna/commit/edfb38fc18209dd20b6b7b8b3fc6e76baadfff66)
- docs(readme): update readme with more documentation [`c9a22d4`](https://github.com/YoeriNijs/vienna/commit/c9a22d440561c3e1a963dcde34250fe78be29923)
- fix(v-repeat): re-enable v-repeat tests [`8fbecd7`](https://github.com/YoeriNijs/vienna/commit/8fbecd7684d1e54f04c3f9937b9ea7a5a78b4ee8)
- fix(v-repeat): fix rendering of multiple v-repeats [`54fd40f`](https://github.com/YoeriNijs/vienna/commit/54fd40fd1aba7647553c5315b2b9c44a102f5f74)
- refactor(host factory): try to fix tests for host factory, not working atm [`3007797`](https://github.com/YoeriNijs/vienna/commit/3007797ec5747256fdc44f24d2a4443cad8d9852)
- revert(husky): move husky hooks to separate files [`8b3e443`](https://github.com/YoeriNijs/vienna/commit/8b3e443f95e8e822b449290aafc79670c04b113c)
- Add release script [`fcf69e0`](https://github.com/YoeriNijs/vienna/commit/fcf69e03fcc68e8e9498a2febb2845fed0a61198)
- Fix repeat bug + add @change attribute [`d97a328`](https://github.com/YoeriNijs/vienna/commit/d97a328d0d6bf324ce15355cc0f4919cf3c85abb)
- Updated [`1cd9b51`](https://github.com/YoeriNijs/vienna/commit/1cd9b511cc31ad56e2bae7b680d64f6c91632736)
- Typo [`f5a64d3`](https://github.com/YoeriNijs/vienna/commit/f5a64d3f77fe9228015e7c02c5542d82966b7f31)
- Update documentation [`61cc19d`](https://github.com/YoeriNijs/vienna/commit/61cc19d50e2632fd74166ed072dfd1c218cd0cab)
- Add root element selector [`2f80945`](https://github.com/YoeriNijs/vienna/commit/2f809458dc8bf7a7a55c5d13a3c7d4d31d82c5a2)
- Add some documentation [`8aa1502`](https://github.com/YoeriNijs/vienna/commit/8aa1502a2bc05b3bb03d3144217897ad7c23d619)
- Working on some documentation [`1af27e0`](https://github.com/YoeriNijs/vienna/commit/1af27e0a1260b0b2a6d6b715b76c094a037c9e07)
- Updated todo [`605808d`](https://github.com/YoeriNijs/vienna/commit/605808d6096b090b4b038783df56ba92e7d0daed)
- Rename [`972aa22`](https://github.com/YoeriNijs/vienna/commit/972aa22ff9f9e259c3601299a9877c8fa78fc51c)
- Clean up [`7862fd9`](https://github.com/YoeriNijs/vienna/commit/7862fd92312e4b2ac06d39511438d87a82878baa)
- Implement output bindings [`a2f2cf0`](https://github.com/YoeriNijs/vienna/commit/a2f2cf0dbb4e2c6b3254ec1e05cb64d1b714d1d7)
- Introduce @bind and @click attributes [`6e2e9ee`](https://github.com/YoeriNijs/vienna/commit/6e2e9ee8af552859a4fa06ccdeb39061be10c0bd)
- Updated [`da617cc`](https://github.com/YoeriNijs/vienna/commit/da617ccc6878fbe87817269aa08d71aa361295fb)
- New Changelog [`86e1911`](https://github.com/YoeriNijs/vienna/commit/86e19110e91bae0d41b910b9c14c60ed181fd037)
- Prepping new release [`28d5336`](https://github.com/YoeriNijs/vienna/commit/28d533680eadf7196c89e8aa3caaa311b936c775)
- Changed script [`5bc4ca6`](https://github.com/YoeriNijs/vienna/commit/5bc4ca691faee828a3d622f2594dc77d8d07c497)
- Prepping new release [`b4364a5`](https://github.com/YoeriNijs/vienna/commit/b4364a51ac2c9a3740f3e96217794882284a9452)
- Fixed nested v-checks + removed internal utils [`6b1ffd7`](https://github.com/YoeriNijs/vienna/commit/6b1ffd7cfb753711763cce875f25ff72505b9e18)
- Added publish script [`62677f0`](https://github.com/YoeriNijs/vienna/commit/62677f0a9badf51526af83ca97d646cd6a6c54ab)
- Cleaned package.json [`aec3526`](https://github.com/YoeriNijs/vienna/commit/aec35268c65bfff92f6992ac64846dde83e754a5)
- Update manual.yml [`8d65bcf`](https://github.com/YoeriNijs/vienna/commit/8d65bcfd82ae1eb1707701e13129619f1c0a64d6)
- Update manual.yml [`6b3ae99`](https://github.com/YoeriNijs/vienna/commit/6b3ae998908db8922f3a005bd05168d27710e0a6)
- Update manual.yml [`62ad12c`](https://github.com/YoeriNijs/vienna/commit/62ad12c3395b9460f70a2792ca9ab5c548578162)
- Update manual.yml [`188f012`](https://github.com/YoeriNijs/vienna/commit/188f0122d12b56c49718adb0ce104f2a21279007)
- Test [`6312f97`](https://github.com/YoeriNijs/vienna/commit/6312f97318116121f713a21c46ac5359e853de2a)
- Add changelog [`39851b7`](https://github.com/YoeriNijs/vienna/commit/39851b75609677c8e1a10a0493d1299a5dea7632)
- Implement Husky the right way [`6dba88e`](https://github.com/YoeriNijs/vienna/commit/6dba88efb1c91ae79866104408db429d51f84b5c)
- Implement Commitizen [`83eebe2`](https://github.com/YoeriNijs/vienna/commit/83eebe2dcec8e2e0998092e11a17e54c712df507)
- New release [`10edde6`](https://github.com/YoeriNijs/vienna/commit/10edde6c1cb01c8f5f753b8d4bddbaae053db2b0)
- Added change detection by implementing a proxy zone [`4010339`](https://github.com/YoeriNijs/vienna/commit/401033967a04568485945df5546742a08c0c097e)
- Added logo because it looks awesome :) [`62f4653`](https://github.com/YoeriNijs/vienna/commit/62f4653efecc2ed21901f6e06634bdf5ce4da23d)
- Add logo [`2a02c7f`](https://github.com/YoeriNijs/vienna/commit/2a02c7fada45d6b34a819db1e1b98686bdaefb70)
- Do not instantiate [`e42d614`](https://github.com/YoeriNijs/vienna/commit/e42d614f59165a98f05fa5e80cd283b4660a022c)
- Added some tests for activated route [`bad14cd`](https://github.com/YoeriNijs/vienna/commit/bad14cd74192f5a53a21994db995029e5604e103)
- First alpha release [`cd8cf96`](https://github.com/YoeriNijs/vienna/commit/cd8cf963a6f517725ab3675453b5189ba0445d43)
- Throw exception when there are no html elements [`4cc8cfa`](https://github.com/YoeriNijs/vienna/commit/4cc8cfa177fbf31ee0ae3689014d50f945dd11ed)
- Fixed some tests [`985a0c2`](https://github.com/YoeriNijs/vienna/commit/985a0c2319c6a71de372b173bef0668497524268)
- Refactored repeat element [`dd215d3`](https://github.com/YoeriNijs/vienna/commit/dd215d39b7765456acb3ba3e6895261f8bf79f11)
- Deleted readme for now [`c4a5615`](https://github.com/YoeriNijs/vienna/commit/c4a5615fed040921f5f0cb88c1fec4ec4cf27d53)
- Fixed repeat bug [`3349a21`](https://github.com/YoeriNijs/vienna/commit/3349a219ab16d6ecaa0bb1a4ac32eb8e3d79c07d)
- Added more tests [`fc0249b`](https://github.com/YoeriNijs/vienna/commit/fc0249b6e06946dc14503bbd50be60474a0c56dd)
- Add some data validation in demo app [`5a6f7e0`](https://github.com/YoeriNijs/vienna/commit/5a6f7e088cb674914ce8351a14672fc289995f05)
- Added testing utilities [`5dedea9`](https://github.com/YoeriNijs/vienna/commit/5dedea9ba5d511815715051f6b0291df2afb5491)
- Reset username as well [`0837b84`](https://github.com/YoeriNijs/vienna/commit/0837b84ec73a78fe8776a6f8b49c84e1374fb092)
- Some minor improvements in demo [`67bd24f`](https://github.com/YoeriNijs/vienna/commit/67bd24f9dd9e2f3fbda28c0b6ea139d849c760b2)
- Use singleton services + removed rxjs dependency + introduced eventbus [`f21c239`](https://github.com/YoeriNijs/vienna/commit/f21c2392595e9e38f18ca69877b5f8db574cd42f)
- Added activated route + guard mechanism [`d68b8cb`](https://github.com/YoeriNijs/vienna/commit/d68b8cbc4a0af0dd6292ce5d40f39fd202cdd2e6)
- Move service [`d2340e6`](https://github.com/YoeriNijs/vienna/commit/d2340e6ad72805adc9fe2656e04d355b5da8d08d)
- Add return type [`c84a5dd`](https://github.com/YoeriNijs/vienna/commit/c84a5ddd09b1c1c9b34498fe3aa1fea42855565d)
- Url param support [`78c5164`](https://github.com/YoeriNijs/vienna/commit/78c51649c70db913bf9dc77894f5fd36032ff212)
- Cleanup [`209f3ad`](https://github.com/YoeriNijs/vienna/commit/209f3ad6de404ea33a864bf67b7571498ab45587)
- Added some tests [`1ee5851`](https://github.com/YoeriNijs/vienna/commit/1ee5851b5cbd27c82bf4f3874ee1e13f4a40301d)
- Minors [`33b0300`](https://github.com/YoeriNijs/vienna/commit/33b0300a0846ee4d1e28f8068ba879466b2e2f88)
- New repeat directive [`663d028`](https://github.com/YoeriNijs/vienna/commit/663d028c05a31b2e98b0383cf6b2129641d1ec60)
- Minor improvements [`90c03b1`](https://github.com/YoeriNijs/vienna/commit/90c03b1e491f8687c5aac544bbfba2735f907a27)
- Introduced new attribute: v-check, refactored a lot [`2c412f1`](https://github.com/YoeriNijs/vienna/commit/2c412f141cd502295a062f7b60e63f744d9d8365)
- Added some ideas [`cab7b8e`](https://github.com/YoeriNijs/vienna/commit/cab7b8e60b3659f55e3944f0e150a6bac449f9af)
- Some ideas [`17fc108`](https://github.com/YoeriNijs/vienna/commit/17fc10843ab1694c6a1e99fc629f7327fe38030a)
- Cleanup [`67cf977`](https://github.com/YoeriNijs/vienna/commit/67cf9776da547c76284cb07b6d241bb409b26936)
- Cleanup [`141a32c`](https://github.com/YoeriNijs/vienna/commit/141a32c8c8e21391a585f4d792a121def1ff2bba)
- Removed deprecated class [`b03032f`](https://github.com/YoeriNijs/vienna/commit/b03032f6f37ef42f39481889a3fc2156bdf6b161)
- Implemented some transformers [`21f1d7f`](https://github.com/YoeriNijs/vienna/commit/21f1d7fa71a1b05bd10d85df4b4a90b0265b6bcc)
- Added new templating engine + added tests [`958e5d0`](https://github.com/YoeriNijs/vienna/commit/958e5d07b355eb00e675ec9779472a3d4d91e898)
- Some literature [`c894583`](https://github.com/YoeriNijs/vienna/commit/c8945830b2e24ce8bc46cec01f2443eca17f5a7f)
- Updated [`aaf49fa`](https://github.com/YoeriNijs/vienna/commit/aaf49fabb7e0c8f0a5e2dd1974373e2cb33921ec)
- Updated [`e70d56d`](https://github.com/YoeriNijs/vienna/commit/e70d56d42d5889222a4fd65c9099cd1a6135c497)
- Updated [`2f38632`](https://github.com/YoeriNijs/vienna/commit/2f38632671e95858fba3996cf7ce648028b834d3)
- Minor bugfixes [`b39945a`](https://github.com/YoeriNijs/vienna/commit/b39945a7fd70ea874c9c68156016c5bedf1f80a8)
- Fixed init bug [`ee8a2bd`](https://github.com/YoeriNijs/vienna/commit/ee8a2bdd270dcde162a28e0e7c11ebeec4946fb7)
- Implemented binding [`1db999e`](https://github.com/YoeriNijs/vienna/commit/1db999ed17670ab470319ea151099de1423855c6)
- Work on binding [`6bcade5`](https://github.com/YoeriNijs/vienna/commit/6bcade5f8e620bb16387bcf297603085a76bbeea)
- Cleanup [`e351135`](https://github.com/YoeriNijs/vienna/commit/e3511353fdac77b29527d5cd34edd3b0a274251f)
- Add change detection [`0bce8ec`](https://github.com/YoeriNijs/vienna/commit/0bce8ecfb8940cf85a44d76983e5067487f5226b)
- Working on demo [`9fcbdf9`](https://github.com/YoeriNijs/vienna/commit/9fcbdf946665a0d3077031f0c2a6a4a27fc4c593)
- Unneeded [`cf8221c`](https://github.com/YoeriNijs/vienna/commit/cf8221cd02ada06b9c7507a503d928559e6f8297)
- Throw error instead [`dd246f7`](https://github.com/YoeriNijs/vienna/commit/dd246f79994dfa6317706df3ed2b4283914c9b49)
- Fixed nested component rendering [`5d46aee`](https://github.com/YoeriNijs/vienna/commit/5d46aee71fcdb5b847bad48363a49c16a28f391a)
- Using webcomponent to render everything [`c7e137e`](https://github.com/YoeriNijs/vienna/commit/c7e137e32fe8da2dd9df544e23204bb423e1604b)
- Some minor lint fixes [`00b7809`](https://github.com/YoeriNijs/vienna/commit/00b78096174e5881c23e21ce76b7a6f378b73d00)
- Implemented dependency injection, clean up a bit [`235e4b2`](https://github.com/YoeriNijs/vienna/commit/235e4b22871d68460225f4f618ea587ac6d6f79c)
- Updated [`f3e61db`](https://github.com/YoeriNijs/vienna/commit/f3e61db4d0658176375eed1e066c10ba0ea4757b)
- Work with nested routes [`32f35c1`](https://github.com/YoeriNijs/vienna/commit/32f35c17019a19ce6ad90f08fec13b314d438388)
- Working on missing route strategy [`a17f041`](https://github.com/YoeriNijs/vienna/commit/a17f0419140125f5732e35acc6b93b89b15baaf5)
- Added lint Husky hook [`0ae4c77`](https://github.com/YoeriNijs/vienna/commit/0ae4c77382aca4deb7263130e0ca25f7edc85f4a)
- Eslint + refactored renderer [`f34a9fb`](https://github.com/YoeriNijs/vienna/commit/f34a9fb58d75fe9a0f777f3aa11d407d0bc4eedf)
- Updated [`702915b`](https://github.com/YoeriNijs/vienna/commit/702915be63366c2d4864c234bad2779025a4ca3c)
- Initial commit [`70336d5`](https://github.com/YoeriNijs/vienna/commit/70336d5a9bc40511653dc3daeeda150166cf3bd8)
- Initial commit [`640a1f4`](https://github.com/YoeriNijs/vienna/commit/640a1f4a0178007992777104ff1f95e50ca37c81)
