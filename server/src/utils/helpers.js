const db = require("../config/database");

exports.checkGroup = (userid, groupname) => {};

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
          results[j].groupIDs = [...results[j].groupIDs, groupResults[i].group_id]
        } else {
          results[j].groups = [
            { name: groupResults[i].name, group_id: groupResults[i].group_id },
          ]
          results[j].groupIDs = [groupResults[i].group_id]
        }
      }
    }
  }
  return results;
};
