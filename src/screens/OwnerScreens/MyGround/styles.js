import {StyleSheet} from 'react-native';
import {ownerColors} from '../../../constants/color';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ownerColors.BACKGROUND,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noGroundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  noGroundText: {
    fontSize: 18,
    color: ownerColors.GRAY_DARK,
    marginVertical: 20,
    textAlign: 'center',
  },
  createButton: {
    width: '70%',
  },
  header: {
    padding: 20,
    backgroundColor: ownerColors.PRIMARY,
    paddingBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: ownerColors.WHITE,
  },
  location: {
    fontSize: 16,
    color: ownerColors.PRIMARY_LIGHT,
    marginTop: 5,
  },
  weekSelector: {
    backgroundColor: ownerColors.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: ownerColors.BORDER,
  },
  weekSelectorContent: {
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  dayButton: {
    width: 60,
    alignItems: 'center',
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 8,
  },
  selectedDay: {
    backgroundColor: ownerColors.PRIMARY,
  },
  dayName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: ownerColors.TEXT_PRIMARY,
  },
  dayDate: {
    fontSize: 16,
    marginTop: 5,
    color: ownerColors.TEXT_PRIMARY,
  },
  selectedDayText: {
    color: ownerColors.WHITE,
  },
  dateContainer: {
    padding: 15,
    backgroundColor: ownerColors.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: ownerColors.BORDER,
  },
  selectedDateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: ownerColors.TEXT_PRIMARY,
  },
  slotsContainer: {
    flex: 1,
    padding: 15,
  },
  noSlotsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  noSlotsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: ownerColors.GRAY_DARK,
  },
});

export default styles;
