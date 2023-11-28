import Badge from '../../components/Badge';
import UserProfile from './components/UserProfile';

export const TABEL_META = [
    {
        key: 'id',
        title: 'Id',
    },
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
