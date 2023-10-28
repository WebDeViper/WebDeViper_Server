exports.duplicateCheck = async (field, value) => {
  const result = await User.findOne({ where: { field: value } });
  if (result) {
    return true;
  } else {
    return false;
  }
};
