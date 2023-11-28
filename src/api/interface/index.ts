// 请求响应参数（不包含data）
export interface Result {
  code: string;
  message: string;
}

// 请求响应参数（包含data）
export interface ResultData<T = any> extends Result {
  data: T;
}

// 分页响应参数
export interface ResPage<T> {
  list: T[];
  pageNum: number;
  pageSize: number;
  total: number;
}

// 分页请求参数
export interface ReqPage {
  pageNum: number;
  pageSize: number;
}

// 文件上传模块
export namespace Upload {
  export interface ResFileUrl {
    fileUrl: string;
    url: string;
  }
}

// 登录模块
export namespace Login {
  export interface ReqChangePasswordForm {
    username: string;
    oldPassword: string;
    newPassword: string;
  }
  export interface ReqLoginForm {
    username: string;
    password: string;
  }
  export interface ResLogin {
    // access_token: string;
    token: string;
  }
  export interface ResAuthButtons {
    [key: string]: string[];
  }

  export interface ResInfo {
    icon: string;
    username: string;
    menus: Menu.ResMenu[];
    roles: String[];
  }
}

// 用户管理模块
export namespace User {
  export interface ReqUserParams extends ReqPage {
    username: string;
    email: string;
    id: string;
    nickName: string;
    password: string;
    status: number;
  }
  export interface ResUserList {
    id: string;
    username: string;
    nickName: string;
    password: string;
    email: string;
    createTime: string;
    status: number;
    avatar: string;
    children?: ResUserList[];
  }
  export interface ResStatus {
    userLabel: string;
    userValue: number;
  }
  export interface ResGender {
    genderLabel: string;
    genderValue: number;
  }
  export interface ResDepartment {
    id: string;
    name: string;
    children?: ResDepartment[];
  }
  export interface ResRole {
    id: string;
    name: string;
    children?: ResDepartment[];
  }
}

export namespace Menu {
  export interface ReqMenuParams {
    id?: string;
    name: string;
    title: string;
    component: string;
    redirect: string;
    icon: string;
    hidden: number;
  }
  export interface ResMenu {
    component: string;
    hidden: number;
    icon: string;
    id: string;
    level: string;
    name: string;
    parentId: string;
    redirect: string;
    sort: string;
    title: string;
    children?: ResMenu[];
  }
}
// 资源
export namespace Resource {
  export interface ReqResourceListParams extends ReqPage {
    categoryId?: number;
    nameKeyword?: string;
    urlKeyword?: string;
  }
  export interface ResourceCategory {
    id: string;
    name: string;
    sort: number;
    createTime: string;
  }
}

// Account
export namespace Account {
  export interface ReqAccountParams extends ReqPage {
    username: string;
  }
  export interface AccountRoles {
    roles: string[];
  }
}
// 角色
export namespace Role {
  export interface RoleParams extends ReqPage {
    id: string;
    name: string;
    description: string;
    adminCount: number;
    createTime: string;
    status: number;
    sort: number;
  }
  export interface ResRole {
    id: string;
    name: string;
    description: string;
    adminCount: number;
    createTime: string;
    status: number;
    sort: number;
    list?: ResRole[];
  }
  export interface RoleSelect extends ResRole {
    roles: string[];
  }
}

export namespace Product {
  export interface ResProduct extends ResPage<ResProduct> {
    id: string;
    title: string;
    description: string;
    content: string;
    status: number;
  }

  export interface ReqProduct {
    id?: string;
    title?: string;
    description?: string;
    content: string;
    // images?: string;
    status?: number;
  }

  export interface ProductEnum {
    id: string;
    title: string;
  }
}
export namespace Appointment {
  export interface ReqAppointmentParams extends ReqPage {
    time?: string[];
    name?: string;
    phone?: string;
  }
  export interface ResAppointment {
    id: string;
    name: string;
    phone: string;
    appointmentTime: string;
    productId: string;
    status: number;
    isSendMsg: Boolean;
    productName: string;
  }
}

export namespace Oss {
  export interface Policy {
    accessKeyId: string;
    callback: string;
    dir: string;
    host: string;
    policy: string;
    signature: string;
  }
}

// CRUD模版代码，新建 直接复制 替换对应tpl
export namespace Tpl {
  export interface Tpl {
    id: string;
  }
  export interface TplParams {
    id: string;
  }
  export interface TplListParams extends ReqPage {
    id: string;
  }
}
