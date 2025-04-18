import {StyleSheet} from 'react-native';
import {playerColors} from '../../../constants/color';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: playerColors.BACKGROUND,
  },
  header: {
    padding: 20,
    backgroundColor: playerColors.PRIMARY,
    paddingBottom: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: playerColors.WHITE,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: playerColors.PRIMARY_LIGHT,
  },
  noGroundsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  noGroundsText: {
    fontSize: 18,
    color: playerColors.GRAY_DARK,
    marginVertical: 20,
  },
  refreshButton: {
    width: '60%',
    marginTop: 20,
  },
  listContainer: {
    padding: 15,
  },
});

export default styles;
