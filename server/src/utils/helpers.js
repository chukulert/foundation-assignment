const db = require("../config/database");

exports.mergeResults = (userResults, groupResults) => {
  const results = [...userResults];

  for (let i = 0; i < groupResults.length; i++) {
    for (let j = 0; j < results.length; j++) {
      if (groupResults[i].user_id == results[j].id) {
        if (results[j].groups && results[j].groupIDs) {
          results[j].groups = [
            ...results[j].groups,
            { name: groupResults[i].name, group_id: groupResults[i].group_id },
          ];
          results[j].groupIDs = [
            ...results[j].groupIDs,
            groupResults[i].group_id,
          ];
        } else {
          results[j].groups = [
            { name: groupResults[i].name, group_id: groupResults[i].group_id },
          ];
          results[j].groupIDs = [groupResults[i].group_id];
        }
      }
    }
  }
  return results;
};

exports.compareGroups = (userGroups, groups) => {
  let result = {
    add: [],
    remove: [],
  };

  const uniqueValuesArr = [...userGroups, ...groups].filter((el) => {
    return !(userGroups.includes(el) && groups.includes(el));
  });

  for (let i = 0; i < uniqueValuesArr.length; i++) {
    if (!userGroups.includes(uniqueValuesArr[i])) {
      result.add = [...result.add, uniqueValuesArr[i]];
    } else {
      result.remove = [...result.remove, uniqueValuesArr[i]];
    }
  }

  return result;
};

exports.checkGroupId = async (userid, groupId) => {
  const query = `SELECT t1.* FROM assignment.user_groups t1 INNER JOIN assignment.groups t2 ON t1.group_id = t2.id WHERE t1.user_id = ? AND t2.id = ?`;
  const results = await db.promise().query(query, [userid, groupId]);

  return results[0].length ? true : false;
};

exports.checkGroupName = async (userid, groupname) => {
  const query = `SELECT t1.* FROM assignment.user_groups t1 INNER JOIN assignment.groups t2 ON t1.group_id = t2.id WHERE t1.user_id = ? AND t2.name = ?`;
  const results = await db.promise().query(query, [userid, groupname]);
  return results[0].length ? true : false;
};

exports.createDateTime = () => {
  const a = new Date().toISOString().slice(0, 19).replace("T", " ");
  const b = new Date().toISOString().slice(0, 10);
  console.log({ a, b });
  return a;
};
