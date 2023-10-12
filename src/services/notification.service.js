const { Notification } = require('../models/notification.model');

const pushNotiToSystem = async ({
  type = 'SHOP-001',
  receiveId = 1,
  senderId = 1,
  options = {},
}) => {
  let noti_content;

  if (type === 'SHOP-001') {
    noti_content = `@@@ vừa mới thêm một sản phẩm @@@@`;
  } else if (type === 'PROMOTION-001') {
    noti_content = `@@@ vừa mới thêm một voucher: @@@@`;
  }

  const newNoti = await Notification.create({
    noti_type: type,
    noti_content,
    noti_senderId: senderId,
    noti_receiveId: receiveId,
    noti_options: options,
  });

  return newNoti;
};

const listNotiByUser = async ({
     userId = 1,
     type = 'ALL',
     isRead = 0
}) => {
    const match = { noti_receiveId: userId }
    if (type !== 'ALL') {
        match['noti_type'] = type
    }

    return await Notification.aggregate([
        {
            $match: match
        }, {
            $project: {
                noti_type: 1,
                noti_senderId: 1,
                noti_receiveId: 1,
                noti_content: 1,
                noti_options: 1,
                createdAt: 1
            }
        }
    ])
}

module.exports = {
  pushNotiToSystem,
  listNotiByUser
};
