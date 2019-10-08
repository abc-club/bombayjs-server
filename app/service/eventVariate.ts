import { Service } from 'egg';

export default class EventVariateService extends Service {
  ProjectValidate: any;

  constructor(props) {
    super(props);
    this.ProjectValidate = {
      project_token: { type: 'string', required: true, trim: true, desc: '新增事件操作：请选择项目' },
      name: { type: 'string', required: true, trim: true, desc: '新增事件操作：事件名称不能为空' },
      marker: { type: 'string', required: true, trim: true, desc: '新增事件操作：事件标识符不能为空' },
      type: { type: 'string', required: true, trim: true, desc: '新增事件操作：事件类型不能为空' },
    };
  }
  async add(ctx) {
    const query = ctx.request.body;
    // 参数校验
    ctx.validate(this.ProjectValidate);
    if (ctx.paramErrors) {
      // get error infos from `ctx.paramErrors`;
      return this.app.retError(ctx.paramErrors[0].desc);
    }
    // 检验是否存在
    const search = await ctx.model.EventVariate.findOne({ name: query.name, type: query.type }).exec();
    if (search) return this.app.retError('新增项目信息操作：事件已存在');

    const variate = ctx.model.EventVariate();
    variate.user_id = [ ctx.currentUserId || '' ];
    variate.project_token = query.project_token;
    variate.name = query.name;
    variate.marker = query.marker;
    variate.type = query.type;
    variate.is_use = query.is_use || 1;

    const result = await variate.save();
    return this.app.retResult(result);
  }
}
