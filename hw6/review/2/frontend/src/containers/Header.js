import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
//import instance from '../api';
import { useScoreCard } from '../hooks/useScoreCard';

const Wrapper = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;

  & button {
    margin-left: 3em;
  }
`;
const instance = axios.create({
  baseURL: `http://localhost:4000`,
});
const Header = () => {
  const { addRegularMessage } = useScoreCard();

  const handleClear = async () => {
    const {
      data: { message },
    } = await instance.delete('/create-card');
    
    // TODO: axios.xxx call the right api
    addRegularMessage(message);
  };

  return (
    <Wrapper>
      <Typography variant="h2">ScoreCard DB</Typography>
      <Button variant="contained" color="secondary" onClick={handleClear}>
        Clear
      </Button>
    </Wrapper>
  );
};

export default Header;
