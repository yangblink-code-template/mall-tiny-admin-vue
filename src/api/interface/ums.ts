export interface UmsAdminParam {
  /** 邮箱 */
  email?: string;
  /** 用户头像 */
  icon?: string;
  /** 用户昵称 */
  nickName?: string;
  /** 备注 */
  note?: string;
  /** 密码 */
  password: string;
  /** 用户名 */
  username: string;
}

/** UmsAdmin */
export interface UmsAdmin {
  /**
   * 创建时间
   * @format date-time
   */
  createTime?: string;
  /** 邮箱 */
  email?: string;
  /** 头像 */
  icon?: string;
  /** @format int64 */
  id?: number;
  /**
   * 最后登录时间
   * @format date-time
   */
  loginTime?: string;
  /** 昵称 */
  nickName?: string;
  /** 备注信息 */
  note?: string;
  password?: string;
  /**
   * 帐号启用状态：0->禁用；1->启用
   * @format int32
   */
  status?: number;
  username?: string;
}
