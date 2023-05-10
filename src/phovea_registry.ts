/* *****************************************************************************
 * Caleydo - Visualization for Molecular Biology - http://caleydo.org
 * Copyright (c) The Caleydo Team. All rights reserved.
 * Licensed under the new BSD license, available at http://caleydo.org/license
 **************************************************************************** */
import { pluginRegistry } from './plugin';
import reg from './phovea';
/**
 * build a registry by registering all phovea modules
 */
// self
pluginRegistry.register('visyn_core', reg);
