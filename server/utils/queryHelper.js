const findRideRequestById = async (models, queryParam, options = {}) => {
  const response = await models.request.findByPk(queryParam, options);
  return response;
};
const findRideById = async (models, queryParam, options = {}) => {
  const response = await models.ride.findByPk(queryParam, options);
  return response;
};
export { findRideRequestById, findRideById };
