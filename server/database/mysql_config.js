/*
 * 설정
 *
 * @date 2019-02-01
 * @author ThreeOn
 */

module.exports = {
//  host: "10.98.3.61",
    host: "211.255.203.126",
    port: 7999,
    user: "kc_etp",
    password: "kc_etp",
    database: "kc_etp",
    db_model: [
        { file: './mysql/user/member_model', modelName: 'UserMember' },
        { file: './mysql/user/etpregister_model', modelName: 'EtpRegister' },
        { file: './mysql/user/indexmanage_model', modelName: 'IndexManage' },
        { file: './mysql/user/etpinfo_model', modelName: 'EtpInfo' },
        { file: './mysql/admin/member_model', modelName: 'AdminMember' },
    ],
}