import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


// --------------------- 1 Healthcheck Controller ---------------------
// simply returns a 200 status code with a message indicating the service is healthy
const healthcheck = asyncHandler(async (req, res) => {
    return res.status(200).json(
        new ApiResponse(200, null, "Healthcheck successful")
    );
})

export {
    healthcheck
}
