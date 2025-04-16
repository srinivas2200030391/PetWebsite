// import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
// import { Avatar, Card } from 'antd';

// const { Meta } = Card;

// const App = () => (
//   <Card
//     style={{ width: 300 }}
//     cover={
//       <img
//         alt="example"
//         src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
//       />
//     }
//     actions={[
//       <SettingOutlined key="setting" />,
//       <EditOutlined key="edit" />,
//       <EllipsisOutlined key="ellipsis" />,
//     ]}
//   >
//     <Meta
//       avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />}
//       title="Card title"
//       description="This is the description"
//     />
//   </Card>
// );

// export default App;



import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Card, Tag } from 'antd';

const { Meta } = Card;

const PetCard = ({ pet }) => {
  return (
    <Card
      style={{ width: 300, margin: '1rem' }}
      cover={
        <img
          alt={pet.name}
          src={pet.images[0] || 'https://via.placeholder.com/300x200.png?text=No+Image'}
          style={{ height: 200, objectFit: 'cover' }}
        />
      }
      actions={[
        <SettingOutlined key="setting" />,
        <EditOutlined key="edit" />,
        <EllipsisOutlined key="ellipsis" />,
      ]}
    >
      <Meta
        avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${pet.name}`} />}
        title={pet.name}
        description={
          <div>
            <p><strong>Breed:</strong> {pet.breed}</p>
            <p><strong>Age:</strong> {pet.age}</p>
            <p><strong>Gender:</strong> {pet.gender}</p>
            <p><strong>Price:</strong> ₹{pet.price}</p>
            <p><strong>Weight:</strong> {pet.weight}</p>
            <p><strong>Category:</strong> {pet.category}</p>
            <Tag color={pet.status === 'Available' ? 'green' : 'volcano'}>
              {pet.status}
            </Tag>
          </div>
        }
      />
    </Card>
  );
};

export default PetCard;
