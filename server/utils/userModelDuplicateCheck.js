exports.duplicateCheck = async (model, field, value) => {
  try {
    // findOne 안에 쓸 객체 정의
    const whereData = {};
    whereData[field] = value;

    const result = await model.findOne({ where: whereData });
    if (result) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};
