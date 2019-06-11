import modulesMiddleware from './Modules.middlewares'
import modulesReducer, { ModulesState } from './Modules.reducer'
import {
  fetchModules,
  fetchModulesCancel,
  ModulesFetchParams,
} from './Modules.actions'

export type ModulesState = ModulesState
export type ModulesFetchParams = ModulesFetchParams

export { modulesMiddleware, modulesReducer, fetchModules, fetchModulesCancel }
