insert into Person (personId, firstName, lastName, address, city, state, zipCode, telephone) values (1, 'Jonathan', 'Ferguson', '21936 Rutledge Alley', 'Lancaster', 'PA', 89676, 3899314390);
insert into Person (personId, firstName, lastName, address, city, state, zipCode, telephone) values (2, 'Emily', 'Jones', '2 Rieder Circle', 'Maple Plain', 'MN', 22139, 7221013067);
insert into Person (personId, firstName, lastName, address, city, state, zipCode, telephone) values (3, 'Joownspurchaseaccounthnny', 'Evans', '1 Gale Hill', 'Salt Lake City', 'UT', 18841, 2278443710);
insert into Person (personId, firstName, lastName, address, city, state, zipCode, telephone) values (4, 'Eugene', 'Henry', '95 Hallows Avenue', 'Jamaica', 'NY', 10374, 8687460868);
insert into Person (personId, firstName, lastName, address, city, state, zipCode, telephone) values (5, 'Earl', 'West', '25 Porter Trail', 'Columbus', 'OH', 41632, 8117932710);
insert into Person (personId, firstName, lastName, address, city, state, zipCode, telephone) values (6, 'Arthur', 'Holmes', '5743 Eggendart Court', 'Atlanta', 'GA', 77591, 8521039476);
insert into Person (personId, firstName, lastName, address, city, state, zipCode, telephone) values (7, 'Henry', 'Warren', '7 Golf Plaza', 'El Paso', 'TX', 83915, 2704737134);
insert into Person (personId, firstName, lastName, address, city, state, zipCode, telephone) values (8, 'Doris', 'Hunt', '77 Kensington Parkway', 'South Bend', 'IN', 64876, 7135522962);
insert into Person (personId, firstName, lastName, address, city, state, zipCode, telephone) values (9, 'Timothy', 'Morgan', '22177 School Crossing', 'Sioux Falls', 'SD', 73447, 8770005878);
insert into Person (personId, firstName, lastName, address, city, state, zipCode, telephone) values (10, 'Douglas', 'Black', '755 Bunting Center', 'Lincoln', 'NE', 19773, 1321635754);

insert into `User` (userId, personId, accountCreateDate, adPreferences, rating, email, salt, hashedPassword) values (1, 1, '2016-05-16 03:15:27', 'Tresom', 10, 'kstone0@bbb.org', '82cbbc787', '82cbbc7876baa7c671eb98bb2362b95f1abaa6ce');
insert into `User` (userId, personId, accountCreateDate, adPreferences, rating, email, salt, hashedPassword) values (2, 2, '2016-02-23 23:39:44', 'Treeflex', 8, 'ktaylor1@elpais.com', '82cbbc787', '82cbbc7876baa7c671eb98bb2362b95f1abaa6ce');
insert into `User` (userId, personId, accountCreateDate, adPreferences, rating, email, salt, hashedPassword) values (3, 3, '2016-05-23 00:39:02', 'Zathin', 0, 'rallen2@vimeo.com', '82cbbc787', '82cbbc7876baa7c671eb98bb2362b95f1abaa6ce');
insert into `User` (userId, personId, accountCreateDate, adPreferences, rating, email, salt, hashedPassword) values (4, 4, '2016-08-25 10:32:01', 'Transcof', 9, 'mpowell3@livejournal.com', '82cbbc787', '82cbbc7876baa7c671eb98bb2362b95f1abaa6ce');
insert into `User` (userId, personId, accountCreateDate, adPreferences, rating, email, salt, hashedPassword) values (5, 5, '2016-10-23 23:12:14', 'Subin', 1, 'afreeman4@ox.ac.uk', '82cbbc787', '82cbbc7876baa7c671eb98bb2362b95f1abaa6ce');
insert into `User` (userId, personId, accountCreateDate, adPreferences, rating, email, salt, hashedPassword) values (6, 6, '2016-07-07 11:02:57', 'Konklux', 7, 'jwilson5@columbia.edu', '82cbbc787', '82cbbc7876baa7c671eb98bb2362b95f1abaa6ce');
insert into `User` (userId, personId, accountCreateDate, adPreferences, rating, email, salt, hashedPassword) values (7, 7, '2016-04-09 12:17:13', 'Bigtax', 4, 'ahudson6@marketwatch.com', '82cbbc787', '82cbbc7876baa7c671eb98bb2362b95f1abaa6ce');
insert into `User` (userId, personId, accountCreateDate, adPreferences, rating, email, salt, hashedPassword) values (8, 8, '2016-05-10 16:37:28', 'Cookley', 9, 'carmstrong7@berkeley.edu', '82cbbc787', '82cbbc7876baa7c671eb98bb2362b95f1abaa6ce');
insert into `User` (userId, personId, accountCreateDate, adPreferences, rating, email, salt, hashedPassword) values (9, 9, '2016-08-29 08:19:56', 'Tres-Zap', 10, 'lrussell8@opensource.org', '82cbbc787', '82cbbc7876baa7c671eb98bb2362b95f1abaa6ce');
insert into `User` (userId, personId, accountCreateDate, adPreferences, rating, email, salt, hashedPassword) values (10, 10, '2016-01-16 09:08:52', 'Aerified', 2, 'ehenry9@storify.com', '82cbbc787', '82cbbc7876baa7c671eb98bb2362b95f1abaa6ce');

insert into `Group` (groupId, groupName, type) values (1, 'Bubblebox', 'focus group');
insert into `Group` (groupId, groupName, type) values (2, 'Quamba', 'Down-sized');
insert into `Group` (groupId, groupName, type) values (3, 'Pixope', 'hybrid');
insert into `Group` (groupId, groupName, type) values (4, 'Plajo', 'Upgradable');
insert into `Group` (groupId, groupName, type) values (5, 'Zoovu', 'multi-state');
insert into `Group` (groupId, groupName, type) values (6, 'Meevee', 'artificial intelligence');
insert into `Group` (groupId, groupName, type) values (7, 'Buzzshare', 'emulation');
insert into `Group` (groupId, groupName, type) values (8, 'Photospace', 'heuristic');
insert into `Group` (groupId, groupName, type) values (9, 'Meevee', 'executive');
insert into `Group` (groupId, groupName, type) values (10, 'Eadel', 'optimizing');

insert into `Page` (pageId, postCount) values (1, 91);
insert into `Page` (pageId, postCount) values (2, 93);
insert into `Page` (pageId, postCount) values (3, 76);
insert into `Page` (pageId, postCount) values (4, 73);
insert into `Page` (pageId, postCount) values (5, 81);
insert into `Page` (pageId, postCount) values (6, 79);
insert into `Page` (pageId, postCount) values (7, 84);
insert into `Page` (pageId, postCount) values (8, 39);
insert into `Page` (pageId, postCount) values (9, 80);
insert into `Page` (pageId, postCount) values (10, 99);

insert into Post (postId, content, commentCount, likes) values (1, 'In sagittis dui vel nisl. Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus.', 98, 3);
insert into Post (postId, content, commentCount, likes) values (2, 'Proin interdum mauris non ligula pellentesque ultrices. Phasellus id sapien in sapien iaculis congue. Vivamus metus arcu, adipiscing molestie, hendrerit at, vulputate vitae, nisl.', 46, 44);
insert into Post (postId, content, commentCount, likes) values (3, 'Curabitur in libero ut massa volutpat convallis. Morbi odio odio, elementum eu, interdum eu, tincidunt in, leo. Maecenas pulvinar lobortis est.', 48, 6);
insert into Post (postId, content, commentCount, likes) values (4, 'In sagittis dui vel nisl. Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus.', 38, 42);
insert into Post (postId, content, commentCount, likes) values (5, 'Suspendisse potenti. In eleifend quam a odio. In hac habitasse platea dictumst.', 68, 79);
insert into Post (postId, content, commentCount, likes) values (6, 'Nulla ut erat id mauris vulputate elementum. Nullam varius. Nulla facilisi.', 61, 54);
insert into Post (postId, content, commentCount, likes) values (7, 'Curabitur in libero ut massa volutpat convallis. Morbi odio odio, elementum eu, interdum eu, tincidunt in, leo. Maecenas pulvinar lobortis est.', 26, 62);
insert into Post (postId, content, commentCount, likes) values (8, 'Integer ac leo. Pellentesque ultrices mattis odio. Donec vitae nisi.', 11, 49);
insert into Post (postId, content, commentCount, likes) values (9, 'faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sapien non mi. Integer ac neque.', 1, 16);
insert into Post (postId, content, commentCount, likes) values (10, 'Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui.', 28, 50);

insert into `Comment` (commentId, content, likes) values (1, 'Curabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem.', 69);
insert into `Comment` (commentId, content, likes) values (2, 'Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat.', 98);
insert into `Comment` (commentId, content, likes) values (3, 'Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui.', 32);
insert into `Comment` (commentId, content, likes) values (4, 'Proin interdum mauris non ligula pellentesque ultrices. Phasellus id sapien in sapien iaculis congue. Vivamus metus arcu, adipiscing molestie, hendrerit at, vulputate vitae, nisl.', 36);
insert into `Comment` (commentId, content, likes) values (5, 'Nullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.', 97);
insert into `Comment` (commentId, content, likes) values (6, 'Nulla ut erat id mauris vulputate elementum. Nullam varius. Nulla facilisi.', 32);
insert into `Comment` (commentId, content, likes) values (7, 'Sed ante. Vivamus tortor. Duis mattis egestas metus.', 71);
insert into `Comment` (commentId, content, likes) values (8, 'Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat.', 64);
insert into `Comment` (commentId, content, likes) values (9, 'In congue. Etiam justo. Etiam pretium iaculis justo.', 50);
insert into `Comment` (commentId, content, likes) values (10, 'Morbi porttitor lorem id ligula. Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem.', 59);

insert into Message (messageId, content, `subject`) values (1, 'Duis bibendum. Morbi non quam nec dui luctus rutrum. Nulla tellus.', 'eget elit sodales scelerisque mauris sit amet eros suspendisse accumsan tortor quis turpis');
insert into Message (messageId, content, `subject`) values (2, 'In quis justo. Maecenas rhoncus alid nulla ultrices aliquet.', 'nulla justo sse accumsan tortor quis turpis');
insert into Message (messageId, content, `subject`) values (3, 'Sed sagittis. Nam congue, ula, sit amet.', 'cubilia curae mauris viverra diam vitae quam suspendisse potenti nullam porttitoposuere');
insert into Message (messageId, content, `subject`) values (4, 'Praesentincidunt eget, tempus vel, pede.', 'venenatis turpis ensto eu massa donec dapibus duis at velit eu est congue');
insert into Message (messageId, content, `subject`) values (5, 'Morbi noenatis non, sodales sed, tincidunt eu, felis.', 'quam sapien varius ut blandit non interdum in ante vestibulum ante');
insert into Message (messageId, content, `subject`) values (6, 'Integer ac leo. Pellentesque ultriceae nisi.', 'nec condimentum neque sapien placerat ante nulla justo aliquam quis turpis eget');
insert into Message (messageId, content, `subject`) values (7, 'Vestibulum quam sapien, luctus et uibus accumsan odiollis.', 'blandit non interdum in antemis in faucibus orc ultrices');
insert into Message (messageId, content, `subject`) values (8, 'pis adipiscing lorem, vitae mattis nibh ligula nec sem.', 'sit amet nunc mper interdum mauris');
insert into Message (messageId, content, `subject`) values (9, 'Nulla ut erat id mauris vulputatilisi.', 'luctus et ultrices posuere cubilia curae duiuis consequat dui');
insert into Message (messageId, content, `subject`) values (10, 'Aliquam se accumsan tortor quis turpis.', 'pretium quis lectus suspe in hac habitasse platea dictumst');

insert into Employee (employeeId, personId, ssn, hourlyRate) values (1, 1, 755157327, 39.05);
insert into Employee (employeeId, personId, ssn, hourlyRate) values (2, 2, 760515331, 47.84);
insert into Employee (employeeId, personId, ssn, hourlyRate) values (3, 3, 242944616, 22.92);
insert into Employee (employeeId, personId, ssn, hourlyRate) values (4, 4, 905247212, 18.39);
insert into Employee (employeeId, personId, ssn, hourlyRate) values (5, 5, 391981359, 11.98);
insert into Employee (employeeId, personId, ssn, hourlyRate) values (6, 6, 468601596, 35.67);
insert into Employee (employeeId, personId, ssn, hourlyRate) values (7, 7, 870618414, 35.62);
insert into Employee (employeeId, personId, ssn, hourlyRate) values (8, 8, 719528189, 37.66);
insert into Employee (employeeId, personId, ssn, hourlyRate) values (9, 9, 184164059, 19.86);
insert into Employee (employeeId, personId, ssn, hourlyRate) values (10, 10, 634362150, 40.73);

insert into Advertisement (advertisementId, adType, company, itemName, content, unitPrice, availableUnits) values (1, 'customer loyalty', 'Walmart', 'Grocery', 'In hac habitasse platea dictumst. Etiam faucibus cursus urna. Ut tellus.', 20.84, 53);
insert into Advertisement (advertisementId, adType, company, itemName, content, unitPrice, availableUnits) values (2, 'capability', 'Barnes and Noble', 'Books', 'Cras non velit nec nisi vulputate nonummy. Maecenas tincidunt lacus at velit. Vivamus vel nulla eget eros elementum pellentesque.', 18.20, 59);
insert into Advertisement (advertisementId, adType, company, itemName, content, unitPrice, availableUnits) values (3, 'Configurable', 'ToysRUs', 'Toys', 'Nullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.', 21.54, 70);
insert into Advertisement (advertisementId, adType, company, itemName, content, unitPrice, availableUnits) values (4, '4th generation', 'Best Buy', 'Electronics', 'Cras mi pede, malesuada in, imperdiet et, commodo vulputate, justo. In blandit ultrices enim. Lorem ipsum dolor sit amet, consectetuer adipiscing elit.', 12.72, 65);
insert into Advertisement (advertisementId, adType, company, itemName, content, unitPrice, availableUnits) values (5, 'task-force', 'Best Buy', 'Computers', 'Pellentesque at nulla. Suspendisse potenti. Cras in purus eu magna vulputate luctus.', 25.64, 43);
insert into Advertisement (advertisementId, adType, company, itemName, content, unitPrice, availableUnits) values (6, 'Reduced', 'Walgreens', 'Health', 'Donec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue. Vestibulum ante ipsum primis in faucibus orci luctusapien non mi. Integer ac neque.', 29.67, 31);
insert into Advertisement (advertisementId, adType, company, itemName, content, unitPrice, availableUnits) values (7, 'task-force', 'Modells', 'Sports', 'Phasellus in felis. Donec semper sapien a libero. Nam dui.', 16.67, 7);
insert into Advertisement (advertisementId, adType, company, itemName, content, unitPrice, availableUnits) values (8, 'Phased', 'Barnes and Noble', 'Books', 'Pellentesque at nulla. Suspendisse potenti. Cras in purus eu magna vulputate luctus.', 10.09, 91);
insert into Advertisement (advertisementId, adType, company, itemName, content, unitPrice, availableUnits) values (9, 'Up-sized', 'Walmart', 'Baby', 'Mauris enim leo, rhoncus sed, vestibulum sit amet, cursus id, turpis. Integer aliquet, massa id lobortis convallis, tolibero.', 36.26, 93);
insert into Advertisement (advertisementId, adType, company, itemName, content, unitPrice, availableUnits) values (10, 'throughput', 'Modells','Sports', 'Nulla ut erat id mauris vulputate elementum. Nullam varius. Nulla facilisi.', 37.53, 10);

insert into PurchaseAccount (accountNumber, creditCard) values (77201, '4405142107638994');
insert into PurchaseAccount (accountNumber, creditCard) values (43956, '5002352031531892');
insert into PurchaseAccount (accountNumber, creditCard) values (48357, '6762304231238552');
insert into PurchaseAccount (accountNumber, creditCard) values (41648, '4936592591119068651');
insert into PurchaseAccount (accountNumber, creditCard) values (90804, '30288878906424');
insert into PurchaseAccount (accountNumber, creditCard) values (63363, '4772573005675');
insert into PurchaseAccount (accountNumber, creditCard) values (71195, '5100148987723876');
insert into PurchaseAccount (accountNumber, creditCard) values (97931, '3567313681578320');
insert into PurchaseAccount (accountNumber, creditCard) values (53695, '3569766799535193');
insert into PurchaseAccount (accountNumber, creditCard) values (99507, '5602212527732210');

insert into OwnsPurchaseAccount (`owner`, accountNumber) values (1, 77201);
insert into OwnsPurchaseAccount (`owner`, accountNumber) values (2, 43956);
insert into OwnsPurchaseAccount (`owner`, accountNumber) values (3, 48357);
insert into OwnsPurchaseAccount (`owner`, accountNumber) values (4, 41648);
insert into OwnsPurchaseAccount (`owner`, accountNumber) values (5, 90804);
insert into OwnsPurchaseAccount (`owner`, accountNumber) values (6, 63363);
insert into OwnsPurchaseAccount (`owner`, accountNumber) values (7, 71195);
insert into OwnsPurchaseAccount (`owner`, accountNumber) values (8, 97931);
insert into OwnsPurchaseAccount (`owner`, accountNumber) values (9, 53695);
insert into OwnsPurchaseAccount (`owner`, accountNumber) values (10, 99507);

insert into Sales (transactionId, dateTimeSold, advertisementId, numberOfUnits, accountNumber) values (1, '2016-10-16 03:23:27', 1, 4, 77201);
insert into Sales (transactionId, dateTimeSold, advertisementId, numberOfUnits, accountNumber) values (2, '2016-3-7 10:12:07', 2, 5, 43956);
insert into Sales (transactionId, dateTimeSold, advertisementId, numberOfUnits, accountNumber) values (3, '2016-6-10 03:23:27', 3, 10, 48357);
insert into Sales (transactionId, dateTimeSold, advertisementId, numberOfUnits, accountNumber) values (4, '2016-9-16 10:02:47', 4, 5, 41648);
insert into Sales (transactionId, dateTimeSold, advertisementId, numberOfUnits, accountNumber) values (5, '2016-11-12 13:38:00', 5, 3, 90804);
insert into Sales (transactionId, dateTimeSold, advertisementId, numberOfUnits, accountNumber) values (6, '2016-08-09 05:23:27', 6, 2, 63363);
insert into Sales (transactionId, dateTimeSold, advertisementId, numberOfUnits, accountNumber) values (7, '2016-05-20 15:12:21', 7, 6, 71195);
insert into Sales (transactionId, dateTimeSold, advertisementId, numberOfUnits, accountNumber) values (8, '2016-06-19 12:30:27', 8, 10, 97931);
insert into Sales (transactionId, dateTimeSold, advertisementId, numberOfUnits, accountNumber) values (9, '2016-09-29 03:39:37', 9, 4, 53695);
insert into Sales (transactionId, dateTimeSold, advertisementId, numberOfUnits, accountNumber) values (10, '2016-02-28 13:50:20', 10, 12, 99507);
insert into Sales (transactionId, dateTimeSold, advertisementId, numberOfUnits, accountNumber) values (11, '2016-10-16 04:23:27', 1, 8, 77201);

insert into AdPostedBy (advertisement, employee, dateTimePosted) values (1, 1, '2016-02-15 12:39:44');
insert into AdPostedBy (advertisement, employee, dateTimePosted) values (2, 2, '2016-02-15 12:39:44');
insert into AdPostedBy (advertisement, employee, dateTimePosted) values (3, 3, '2016-02-15 12:39:44');
insert into AdPostedBy (advertisement, employee, dateTimePosted) values (4, 1, '2016-02-16 1:39:44');
insert into AdPostedBy (advertisement, employee, dateTimePosted) values (5, 2, '2016-02-16 1:39:44');
insert into AdPostedBy (advertisement, employee, dateTimePosted) values (6, 3, '2016-02-17 1:39:44');
insert into AdPostedBy (advertisement, employee, dateTimePosted) values (7, 1, '2016-02-16 2:39:44');
insert into AdPostedBy (advertisement, employee, dateTimePosted) values (8, 2, '2016-02-15 12:39:44');
insert into AdPostedBy (advertisement, employee, dateTimePosted) values (9, 3, '2016-02-17 12:39:44');
insert into AdPostedBy (advertisement, employee, dateTimePosted) values (10, 1, '2016-02-18 12:39:44');