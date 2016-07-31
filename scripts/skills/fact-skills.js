mod = angular.module('sin.fact.skills', ['sin.lib.persist']);

mod.factory('skills', function(persist) {
    var factory = {};
    var state = {};

    factory.data = {
        dataCacheTime: (7 * 24 * 60 * 60 * 1000),   //one week in milliseconds
        rawSlotSkill: [1,2,4,6,10,-1],
        rawSlotSpec: [5,10,15,-1]
    };

    // --------------------------------------------------

    function defaultState() {
        state.tree = {};
        state.treeTypes = [];
        state.processed = false;
    }

    defaultState();

    // --------------------------------------------------

    Object.defineProperty(factory, 'tree', {
        get: function() { return state.tree; },
        enumerable: true
    });

    Object.defineProperty(factory, 'treeTypes', {
        get: function() { return state.treeTypes; },
        enumerable: true
    });

    // --------------------------------------------------

    factory.getSkillTree = function() {
        return state.tree;
    };
  
    factory.getTreeTypes = function() {
        return state.treeTypes;
    };
  
    factory.treeAddSkill = function(skill) {
        if (state.tree[skill] === undefined) return false;
        if (state.tree[skill].trained) return false;
    
        state.tree[skill].trained = true;
        return true;
    };
  
    factory.treeAddSpec = function(skill, spec) {
        if (state.tree[skill] === undefined) return false;
        if (state.tree[skill].specs[spec] === undefined) return false;
        if (state.tree[skill].specs[spec].trained) return false;
    
        state.tree[skill].specs[spec].trained = true;
        return true;
    };
  
    factory.treeRemoveSkill = function(skill) {
        if (state.tree[skill] === undefined) return false;
        if (!state.tree[skill].trained) return false;
    
        state.tree[skill].trained = false;
        state.tree[skill].rank = 0;
        state.tree[skill].slots = 0;
    
        for(var spec in state.tree[skill].specs)
            factory.state.treeRemoveSpec(skill, spec);

        return true;
    };

    factory.treeRemoveSpec = function(skill, spec) {
        if (state.tree[skill] === undefined) return false;
        if (state.tree[skill].specs[spec] === undefined) return false;
        if (!state.tree[skill].specs[spec].trained) return false;

        state.tree[skill].specs[spec].trained = false;
        state.tree[skill].specs[spec].rank = 0;
        state.tree[skill].specs[spec].slots = 0;
        return true;
    };

    // --------------------------------------------------

    factory.treeHasTypeTrained = function(type) {
        for (var skill in state.tree) {
            if (state.tree[skill].type == type) {
                if (state.tree[skill].trained) {
                    return true;
                }
            }
        }
        return false;
    };

    factory.treeFilterAll = function() {
        return Object.keys(state.tree);
    };

    factory.treeFilterNotType = function(type) {
        return Object.keys(state.tree).filter(function(val) {
            return (state.tree[val].type != type);
        });
    };

    factory.treeFilterTrained = function() {
        return Object.keys(state.tree).filter(function(val) {
            return state.tree[val].trained;
        });
    };

    factory.treeFilterUntrained = function() {
        return Object.keys(state.tree).filter(function(val) {
            return !state.tree[val].trained;
        });
    };

    factory.treeFilterTypeTrained = function(type) {
        return Object.keys(state.tree).filter(function(val) {
            return (state.tree[val].type == type) && state.tree[val].trained;
        });
    };

    factory.treeFilterSpecTrained = function(skill) {
        if (!skill) return [];
        return Object.keys(state.tree[skill].specs).filter(function(val) {
            return state.tree[skill].specs[val].trained;
        });
    };

    factory.treeFilterSpecUntrained = function(skill) {
        if (!skill) return [];
        return Object.keys(state.tree[skill].specs).filter(function(val) {
            return !state.tree[skill].specs[val].trained;
        });
    };

    // --------------------------------------------------

    factory.treeSkillRank = function(skill) {
        if (!(skill in state.tree)) return 0;
        return state.tree[skill].rank;
    };

    factory.treeSpecRank = function(skill, spec) {
        if (!(skill in state.tree)) return 0;
        if (!(spec in state.tree[skill].specs)) return 0;
        return state.tree[skill].specs[spec].rank;
    };

    factory.treeSkillSlot = function(skill) {
        return factory.data.rawSlotSkill[state.tree[skill].rank];
    };

    factory.treeSpecSlot = function(skill, spec) {
        return factory.data.rawSlotSpec[state.tree[skill].specs[spec].rank];
    };

    factory.treeSkillName = function(skill) {
        return state.tree[skill].name;
    };

    factory.treeSpecName = function(skill, spec) {
        return state.tree[skill].specs[spec].name;
    };

    // --------------------------------------------------

    persist.registerLoad(function() { state = persist.doLoad('sin.fact.skills', state); });
    persist.registerSave(function() { persist.doSave('sin.fact.skills', state); });
    persist.registerWipe(function() { defaultState(); });

    // --------------------------------------------------

    var convertSkillRankToSlots = function (rank) {
        if (rank<0) return -1;
        if (rank>5) return -1;

        var slots = 0;
        for (var i = 0; i < rank; i++) {
            slots += factory.data.rawSlotSkill[i];
        }
        return slots;
    };

    var convertSpecRankToSlots = function (rank) {
        if (rank<0) return -1;
        if (rank>3) return -1;

        var slots = 0;
        for (var i = 0; i < rank; i++) {
            slots += factory.data.rawSlotSpec[i];
        }
        return slots;
    };

    // --------------------------------------------------

    factory.data.rawSkills = {
        1:   {id:1,   parent:0, name: 'Mind'},
        2:   {id:2,   parent:0, name: 'Body'},
        3:   {id:3,   parent:0, name: 'Tech'},
        4:   {id:4,   parent:0, name: 'Soul'},
        //---------------
        5:   {id:5,   parent:1, name:'CorpDeal'},
        6:   {id:6,   parent:1, name:'Forensics'},
        7:   {id:7,   parent:1, name:'Knowledge'},
        8:   {id:8,   parent:1, name:'Language'},
        9:   {id:9,   parent:1, name:'Law'},
        10:  {id:10,  parent:1, name:'Law Enforcement'},
        11:  {id:11,  parent:1, name:'Media'},
        12:  {id:12,  parent:1, name:'Medical'},
        13:  {id:13,  parent:1, name:'Military'},
        14:  {id:14,  parent:1, name:'Net Lore'},
        15:  {id:15,  parent:1, name:'Netrunning'},
        16:  {id:16,  parent:3, name:'Pharmocology'},
        17:  {id:17,  parent:1, name:'Psychology'},
        18:  {id:18,  parent:1, name:'Science'},
        19:  {id:19,  parent:1, name:'Sstate.treetDeal'},
        20:  {id:20,  parent:1, name:'Sstate.treetWise'},
        21:  {id:21,  parent:1, name:'Survival'},
        22:  {id:22,  parent:2, name:'Dodge'},
        23:  {id:23,  parent:2, name:'Endurance'},
        // 24 ?!
        25:  {id:25,  parent:2, name:'Firearms'},
        26:  {id:26,  parent:2, name:'Heavy Weapons'},
        27:  {id:27,  parent:2, name:'Melee'},
        28:  {id:28,  parent:2, name:'Unarmed Combat'},
        29:  {id:29,  parent:3, name:'Bioware Engineering'},
        30:  {id:30,  parent:3, name:'Cyberware Engineering'},
        31:  {id:31,  parent:3, name:'Demolitions'},
        32:  {id:32,  parent:3, name:'Drive'},
        33:  {id:33,  parent:3, name:'Electronics'},
        34:  {id:34,  parent:3, name:'Mechanical Engineering'},
        35:  {id:35,  parent:3, name:'Nanoscale Engineering'},
        36:  {id:36,  parent:3, name:'Paramedic'},
        37:  {id:37,  parent:3, name:'Pilot'},
        38:  {id:38,  parent:3, name:'Programming'},
        39:  {id:39,  parent:3, name:'Security Systems'},
        40:  {id:40,  parent:3, name:'Surgery'},
        41:  {id:41,  parent:3, name:'Surveillance'},
        42:  {id:42,  parent:3, name:'Weapon Smith'},
        43:  {id:43,  parent:4, name:'Luck'},
        //---------------
        44:  {id:44,  parent:5,  name:'Military'},
        45:  {id:45,  parent:5,  name:'Law Enforcement'},
        46:  {id:46,  parent:5,  name:'Science'},
        47:  {id:47,  parent:5,  name:'Matrix'},
        48:  {id:48,  parent:5,  name:'Media'},
        49:  {id:49,  parent:6,  name:'CSI'},
        50:  {id:50,  parent:6,  name:'Pathology'},
        51:  {id:51,  parent:6,  name:'Lab'},
        52:  {id:52,  parent:7,  name:'Popular Culture'},
        53:  {id:53,  parent:7,  name:'Ancient History'},
        54:  {id:54,  parent:7,  name:'Modern History'},
        55:  {id:55,  parent:7,  name:'Occult'},
        56:  {id:56,  parent:7,  name:'Religions'},
        57:  {id:57,  parent:7,  name:'Politics'},
        58:  {id:58,  parent:7,  name:'Conspiracy Theory'},
        59:  {id:59,  parent:7,  name:'Survival'},
        60:  {id:60,  parent:8,  name:'English'},
        61:  {id:61,  parent:8,  name:'Italian'},
        62:  {id:62,  parent:9,  name:'Contract'},
        63:  {id:63,  parent:9,  name:'Media'},
        64:  {id:64,  parent:9,  name:'Property'},
        65:  {id:65,  parent:9,  name:'International'},
        66:  {id:66,  parent:10, name:'Special Unit - Carbinieri'},
        67:  {id:67,  parent:10, name:'Special Unit - Polstrada'},
        68:  {id:68,  parent:10, name:'International'},
        69:  {id:69,  parent:10, name:'Bounty Hunting'},
        70:  {id:70,  parent:10, name:'Intelligence Agencies'},
        71:  {id:71,  parent:10, name:'Homicide'},
        72:  {id:72,  parent:10, name:'Riot'},
        73:  {id:73,  parent:10, name:'Vice'},
        74:  {id:74,  parent:10, name:'Tactical'},
        75:  {id:75,  parent:10, name:'Body Guard'},
        76:  {id:76,  parent:11, name:'Current Affairs/News'},
        77:  {id:77,  parent:11, name:'Scream Sheets/Gossip'},
        78:  {id:78,  parent:11, name:'Broadcast'},
        79:  {id:79,  parent:11, name:'Investigative'},
        80:  {id:80,  parent:11, name:'Presenting/Performance'},
        81:  {id:81,  parent:11, name:'Writing'},
        82:  {id:82,  parent:12, name:'GP'},
        83:  {id:83,  parent:12, name:'Research'},
        84:  {id:84,  parent:12, name:'Diagnosis'},
        85:  {id:85,  parent:12, name:'Disease/viral/bacterial'},
        86:  {id:86,  parent:12, name:'Technology'},
        87:  {id:87,  parent:12, name:'Mutation'},
        88:  {id:88,  parent:13, name:'Commando'},
        89:  {id:89,  parent:13, name:'Tactical'},
        90:  {id:90,  parent:13, name:'Supply'},
        91:  {id:91,  parent:13, name:'Equipment'},
        92:  {id:92,  parent:13, name:'Operational'},
        93:  {id:93,  parent:13, name:'Strategy'},
        94:  {id:94,  parent:13, name:'Airborne'},
        95:  {id:95,  parent:14, name:'Rumors'},
        96:  {id:96,  parent:14, name:'Reputations'},
        97:  {id:97,  parent:15, name:'Non Matrix Computer use'},
        98:  {id:98,  parent:15, name:'Cyberhacking'},
        99:  {id:99,  parent:15, name:'Darknet'},
        100: {id:100, parent:15, name:'POTS (Plain Old Telephone System)'},
        101: {id:101, parent:16, name:'Combat'},
        102: {id:102, parent:16, name:'Medical'},
        103: {id:103, parent:16, name:'Recreational'},
        104: {id:104, parent:16, name:'Exotic'},
        105: {id:105, parent:17, name:'Cyberpsychosis'},
        106: {id:106, parent:17, name:'Forensic'},
        107: {id:107, parent:18, name:'Biology'},
        108: {id:108, parent:18, name:'Chemistry'},
        109: {id:109, parent:18, name:'Physics'},
        110: {id:110, parent:18, name:'Nanotech'},
        111: {id:111, parent:19, name:'Military'},
        112: {id:112, parent:19, name:'Narcotics'},
        113: {id:113, parent:19, name:'Luxury'},
        114: {id:114, parent:19, name:'Retro'},
        115: {id:115, parent:19, name:'Tech'},
        116: {id:116, parent:19, name:'Commodities'},
        117: {id:117, parent:19, name:'Labour'},
        118: {id:118, parent:19, name:'Pimping'},
        119: {id:119, parent:19, name:'Edgerunners'},
        120: {id:120, parent:20, name:'Gangs/Organisations'},
        121: {id:121, parent:20, name:'Area Knowledge'},
        122: {id:122, parent:20, name:'Social/Entertainment'},
        123: {id:123, parent:20, name:'Reputation (Other peoples)'},
        124: {id:124, parent:20, name:'Rumours'},
        125: {id:125, parent:21, name:'Arctic'},
        126: {id:126, parent:21, name:'Desert'},
        127: {id:127, parent:21, name:'NBC'},
        128: {id:128, parent:21, name:'Urban'},
        129: {id:129, parent:22, name:'Melee'},
        130: {id:130, parent:22, name:'Unarmed'},
        131: {id:131, parent:22, name:'Area Effect'},
        132: {id:132, parent:22, name:'Intercept'},
        133: {id:133, parent:23, name:'Pain/Torture'},
        134: {id:134, parent:23, name:'Burn'},
        135: {id:135, parent:23, name:'Stamina/Strain'},
        136: {id:136, parent:23, name:'Stun/Shock'},
        137: {id:137, parent:23, name:'Toxin'},
        138: {id:138, parent:26, name:'Vehicle Mounted'},
        139: {id:139, parent:26, name:'Machine Gun'},
        140: {id:140, parent:26, name:'Grenade Launcher'},
        141: {id:141, parent:27, name:'Whips'},
        142: {id:142, parent:25, name:'Pistol'},
        // 143 ?!
        144: {id:144, parent:26, name:'Missile'},
        145: {id:145, parent:26, name:'Jet (Flame/Water)'},
        // 146 ?!
        // 147 ?!
        148: {id:148, parent:25, name:'SMG'},
        149: {id:149, parent:25, name:'Assault/Battle Rifle'},
        150: {id:150, parent:25, name:'Sniper Rifle'},
        151: {id:151, parent:25, name:'Shotgun'},
        // 152 ?!
        153: {id:153, parent:27, name:'Knife (<= 12\')'},
        154: {id:154, parent:27, name:'Sword (>12\')'},
        155: {id:155, parent:27, name:'Unbalanced (Hammer/axe etc)'},
        156: {id:156, parent:27, name:'Polearm'},
        157: {id:157, parent:27, name:'Stun'},
        158: {id:158, parent:28, name:'Stun'},
        159: {id:159, parent:28, name:'Strength'},
        160: {id:160, parent:29, name:'Neuralware'},
        161: {id:161, parent:29, name:'Cosmetic'},
        162: {id:162, parent:29, name:'Weaponry'},
        163: {id:163, parent:29, name:'Gene Therapy'},
        164: {id:164, parent:30, name:'Cybersense'},
        165: {id:165, parent:30, name:'Neuralware'},
        166: {id:166, parent:30, name:'Weaponry'},
        167: {id:167, parent:31, name:'Structure hitting'},
        168: {id:168, parent:31, name:'Military'},
        169: {id:169, parent:31, name:'Manufacture'},
        170: {id:170, parent:31, name:'Esoteric explosives'},
        171: {id:171, parent:32, name:'Tracked'},
        172: {id:172, parent:32, name:'Automotive'},
        173: {id:173, parent:33, name:'Cybermodems'},
        174: {id:174, parent:33, name:'Computers'},
        175: {id:175, parent:33, name:'Security Systems'},
        176: {id:176, parent:33, name:'Medic tech'},
        177: {id:177, parent:33, name:'Military Tech'},
        178: {id:178, parent:34, name:'Industrial (factory installation)'},
        179: {id:179, parent:34, name:'Military'},
        180: {id:180, parent:34, name:'Aeronautical'},
        181: {id:181, parent:34, name:'Naval'},
        182: {id:182, parent:36, name:'Toxic/Tranq'},
        183: {id:183, parent:36, name:'Ballistic/Fragmentation/Laceration'},
        184: {id:184, parent:36, name:'Blunt Trauma'},
        185: {id:185, parent:36, name:'Stabilise'},
        186: {id:186, parent:36, name:'Stab/Cut/Dismember'},
        187: {id:187, parent:37, name:'Jet'},
        188: {id:188, parent:37, name:'AV / Vectored Thrust'},
        189: {id:189, parent:37, name:'Helicopter'},
        190: {id:190, parent:37, name:'Prop'},
        191: {id:191, parent:37, name:'Commercial'},
        192: {id:192, parent:38, name:'Non-Matrix Interfaces'},
        193: {id:193, parent:39, name:'Electronic security'},
        194: {id:194, parent:39, name:'Counter Surveillance'},
        195: {id:195, parent:39, name:'Locks / Safes'},
        196: {id:196, parent:39, name:'Improvised'},
        197: {id:197, parent:40, name:'Bioware'},
        198: {id:198, parent:40, name:'Emergency'},
        199: {id:199, parent:40, name:'Medical'},
        200: {id:200, parent:41, name:'Encryption/communications systems'},
        201: {id:201, parent:41, name:'Tailing/tracking'},
        202: {id:202, parent:41, name:'Counter Surveillance'},
        203: {id:203, parent:41, name:'Technical'},
        204: {id:204, parent:42, name:'Firearms'},
        205: {id:205, parent:42, name:'Heavy Weapons'},
        206: {id:206, parent:42, name:'Melee'},
        207: {id:207, parent:42, name:'Swords'},
        208: {id:208, parent:42, name:'Accessories'},
        // 209 ?!
        210: {id:210, parent:22, name:'Projectile'},
        211: {id:211, parent:27, name:'Whips / Chains'},
        212: {id:212, parent:28, name:'Martial Art Weapon'},
        301: {id:301, parent:15, name:'System Exploits'}
        //---------------
        //1001: {id:1001, parent:1, name: 'Generic Mind Skill'},
        //1011: {id:1011, parent:1001, name: 'Generic Mind Spec A'},
        //1012: {id:1012, parent:1001, name: 'Generic Mind Spec B'},
        //1002: {id:1002, parent:2, name: 'Generic Body Skill'},
        //1021: {id:1021, parent:1002, name: 'Generic Body Spec A'},
        //1022: {id:1022, parent:1002, name: 'Generic Body Spec B'},
        //1003: {id:1003, parent:3, name: 'Generic Tech Skill'},
        //1031: {id:1031, parent:1003, name: 'Generic Tech Spec A'},
        //1032: {id:1032, parent:1003, name: 'Generic Tech Spec B'},
        //1004: {id:1004, parent:4, name: 'Generic Soul Skill'},
        //1041: {id:1041, parent:1004, name: 'Generic Soul Spec A'},
        //1042: {id:1042, parent:1004, name: 'Generic Soul Spec B'},
    };

    // --------------------------------------------------

    var processDataTree = function() {
        if (state.processed) {
            console.log('Skill data state.tree already processed');
            return;
        }

        var base;
        var skill;
        var spec;

        for (base in factory.data.rawSkills) {
            if (factory.data.rawSkills[base].parent === 0) {
                state.treeTypes.push(factory.data.rawSkills[base].name);
            }
        }
        for (skill in factory.data.rawSkills) {
            if (factory.data.rawSkills[skill].parent > 0 && factory.data.rawSkills[skill].parent <=4) {
                base = factory.data.rawSkills[skill].parent;
                state.tree[skill] = {
                    id: skill,
                    name: factory.data.rawSkills[skill].name,
                    type: factory.data.rawSkills[base].name,
                    trained: factory.data.rawSkills[skill].trained ? true : false,
                    rank: 0,
                    slots: 0,
                    specs: {}
                };
            }
        }
        for (spec in factory.data.rawSkills) {
            if (factory.data.rawSkills[spec].parent > 4) {
                skill = factory.data.rawSkills[spec].parent;
                state.tree[skill].specs[spec] = {
                    id: spec,
                    name: factory.data.rawSkills[spec].name,
                    trained: factory.data.rawSkills[spec].trained ? true : false,
                    rank: 0,
                    slots: 0
                };
            }
        }

        state.processed = true;
    };

    processDataTree();

    // --------------------------------------------------

    return factory;
});
