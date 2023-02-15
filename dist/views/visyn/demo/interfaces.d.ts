import { VisynSimpleViewPluginType } from '../interfaces';
import type { VisColumn, IVisConfig } from '../../../vis/interfaces';
export type DemoVisynViewPluginType = VisynSimpleViewPluginType<{
    columns: VisColumn[] | null;
    config: IVisConfig | null;
    dataLength: number;
}>;
//# sourceMappingURL=interfaces.d.ts.map