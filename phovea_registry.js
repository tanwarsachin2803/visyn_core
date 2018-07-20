/* *****************************************************************************
 * Caleydo - Visualization for Molecular Biology - http://caleydo.org
 * Copyright (c) The Caleydo Team. All rights reserved.
 * Licensed under the new BSD license, available at http://caleydo.org/license
 **************************************************************************** */

import {register} from 'phovea_core/src/plugin';
import reg from './src/phovea';
/**
 * build a registry by registering all phovea modules
 */
//other modules
import 'phovea_clue/phovea_registry.js';
//self
register('tdp_core', reg);
