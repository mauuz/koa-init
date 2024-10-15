const {updateStorage} = require('../../service/update');
const {dmLogin} = require("../../service/login");
const {createResponse} = require('../../response');
class UpdateController {
    async updateGoodDetail(ctx,next){
        try {
            ctx.body = createResponse('success',await updateStorage(ctx.request.body,ctx.state.DMDToken));
        }catch (e) {
            ctx.body = createResponse('fail',e);
        }

    }



}
module.exports = new UpdateController();