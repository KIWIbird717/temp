import { Schema, Model, model, Document } from "mongoose";
import { ErrorService, ErrorType} from "../../utils/errorHandler";

/**
 * interface for `Менеджер аккаунов` page
 */
export interface IAccountsManagerFolder extends Document {
  key: string;
  apiHash: string;
  apiId: number;
  folder: string;
  dopTitle: string;
  accountsAmount: number;
  country: string;
  latestActivity: Date;
  banned: number;
  accounts: [
    {
      key: string;
      avatar?: string;
      phoneNumber: string;
      resting: Date | number;
      userName: string;
      firstName?: string;
      lastName?: string;
      secondFacAith: string;
      proxy: string;
      latestActivity: Date;
      status: "success" | "warning" | "error" | string;
      telegramSession: string;
      apiId?: number;
      apiHash?: string;
    },
  ]
}


/**
 * interface for `Менеджер proxy` page
 */
interface IProxyManagerFolder extends Document {
  key: string;
  folder: string;
  dopTitle: string;
  proxiesAmount: number;
  country: string;
  latestActivity: Date;
  proxies: [
    {
      key: string;
      ip: string;
      port: string;
      login: string;
      pass: string;
      type: string;
      delay: string;
      status: "success" | "error" | string;
    }
  ];
}

/**
 * interface for `Авторегистратор` page
 * Sidebar component with recent user`s registered accounts
 */
interface IRecentAutoregActivity extends Document {
  key: string;
  status: "success" | "warning" | "error";
  title: string;
  description: string;
  date: Date;
}

/**
 * Global user interface for MongoDB
 */
export interface IRegisterUserSchema extends Document {
  nick: string;
  mail: string;
  password: string;
  defaultAppHash: string;
  defaultAppId: number;
  accountsManagerFolder: IAccountsManagerFolder[];
  proxyManagerFolder: IProxyManagerFolder[];
  recentAutoregActivity: IRecentAutoregActivity[];
}

/**
 * User info
 * `Response from MongoDB`
 */
export interface IUserRes {
  _id: string;
  nick: string;
  mail: string;
  password: string;
  defaultAppHash: string;
  defaultAppId: number;
  accountsManagerFolder: IAccountsManagerFolder[];
  proxyManagerFolder: IProxyManagerFolder[];
  recentAutoregActivity: IRecentAutoregActivity[];
  createdAt: Date;
  updatedAt: Date;
  errorList: [{
    service: ErrorService | string;
    status: ErrorType | string;
    message: string;
  }];
  __v: number;
}

interface IRegisterUserModel extends Model<IRegisterUserSchema> {}

const AccountsDataSchema = new Schema<IAccountsManagerFolder["accounts"][0]>({
  key: String,
  avatar: {type: String, require: false},
  phoneNumber: String,
  resting: Number,
  userName: String,
  firstName: {type: String, require: false},
  lastName: {type: String, require: false},
  secondFacAith: String,
  proxy: String,
  latestActivity: Date,
  status: String,
  telegramSession: String,
  apiId: {type: Number, require: false},
  apiHash: {type: String, require: false},
})

const AccountsManagerFolderSchema = new Schema<IAccountsManagerFolder>({
  key: String,
  apiHash: String,
  apiId: { type: Number, require: false },
  folder: String,
  dopTitle: String,
  accountsAmount: Number,
  country: String,
  latestActivity: Date,
  banned: Number,
  accounts: [AccountsDataSchema],
});

const ProxyManagerFolderSchema = new Schema<IProxyManagerFolder>({
  key: String,
  folder: String,
  dopTitle: String,
  proxiesAmount: Number,
  country: String,
  latestActivity: Date,
  proxies: [
    {
      key: String,
      ip: String,
      port: String,
      login: String,
      pass: String,
      type: String,
      delay: String,
      status: String,
    },
  ],
});

const RecentAutoregActivitySchema = new Schema<IRecentAutoregActivity>({
  key: String,
  status: { type: String, enum: ["success", "warning", "error"] },
  title: String,
  description: String,
  date: Date,
});

const registerUserSchema: Schema = new Schema(
  {
    nick: { type: String, require: true },
    mail: { type: String, require: true },
    defaultAppHash: { type: String, require: true }, // по дефолту "null"
    defaultAppId: { type: Number, require: true }, // по дефолту 0
    password: { type: String, require: true },
    accountsManagerFolder: {
      type: [AccountsManagerFolderSchema],
      require: false,
    },
    proxyManagerFolder: { type: [ProxyManagerFolderSchema], require: false },
    recentAutoregActivity: {
      type: [RecentAutoregActivitySchema],
      require: false,
    },
  },
  { timestamps: true }
);

/**
 * New `User` DB schema
 *
 * @description
 * Registrate new user in application
 */
export const RegisterUserSchema: IRegisterUserModel = model<IRegisterUserSchema>("RegisterUserSchema", registerUserSchema)
