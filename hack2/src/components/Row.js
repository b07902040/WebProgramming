import Grid from '../components/Grid'
export default function Row ({ row_vec, row_i} ) {
    return (
        <tr>
          <Grid value={row_vec[0]} row_i={row_i} col_j={0}/>
          <Grid value={row_vec[1]} row_i={row_i} col_j={1}/>
          <Grid value={row_vec[2]} row_i={row_i} col_j={2}/>
          <Grid value={row_vec[3]} row_i={row_i} col_j={3}/>)
        </tr>
    );
};