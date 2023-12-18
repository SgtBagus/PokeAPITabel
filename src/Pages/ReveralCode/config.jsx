import Badge from '../../Components/Badge';
import UserProfile from './Components/UserProfile';

export const TABEL_META = [
    {
        key: 'code',
        title: 'Code Revelal',
    },
    {
        key: 'desc',
        title: 'Dekripsi',
    },
    {
        key: 'discValue',
        title: 'Diskon',
        Cell: (val) => (<>{val} %</>)
    },
    {
        key: 'statusValue',
        title: 'Status Reveral Code',
        Cell: (val) => (val ? (<Badge className="badge bg-primary" label="Aktif" />) : (<Badge className="badge bg-danger" label="Tidak Aktif" />))
    },
    {
        key: 'userId',
        title: 'Pengguna Reveral Code',
        Cell: (val) => (<UserProfile selectedUid={val} />)
    },
];
