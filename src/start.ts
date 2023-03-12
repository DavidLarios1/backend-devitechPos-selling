import { RunTasks } from './modules/tasks/RunTasks';
import { NotifyChannels } from './libraries/constants/NotifyChannels';
import { ChannelsDBConfig } from './modules/listenerDB/ChannelsDBConfig';
import { ListenerDataBase } from './modules/listenerDB/LintenerDataBase';
import { ProceduresHandler } from './modules/proceduresDB/ProceduresHandler';

export class StartServices {
  private runTasks: RunTasks;

  private listenerDataBase: ListenerDataBase;

  private proceduresHandler: ProceduresHandler;

  constructor() {
    this.runTasks = new RunTasks();
    this.listenerDataBase = new ListenerDataBase();
    this.proceduresHandler = new ProceduresHandler();
  }

  /**
     * Run
     */
  public Run() {
    console.log('::: Prepared Start :::');

    this.listenerDataBase.listen(Object.values(NotifyChannels));

    const clannelsEmit = new ChannelsDBConfig(this.listenerDataBase);
    clannelsEmit.inicializeChannels();

    this.runTasks.run();

    this.proceduresHandler.CreateAllProcedures();
    console.log('::: Prepared End :::');
  }
}
