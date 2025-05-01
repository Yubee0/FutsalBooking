import {StyleSheet} from 'react-native';
import {ownerColors} from '../../../constants/color';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ownerColors.BACKGROUND,
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
    maxHeight: 70, // Added to control height
  },
  weekSelectorContent: {
    paddingHorizontal: 10,
    paddingVertical: 10, // Reduced from 15
  },
  dayButton: {
    width: 50, // Reduced from 60
    alignItems: 'center',
    paddingVertical: 8, // Reduced from 10
    marginHorizontal: 4, // Reduced from 5
    borderRadius: 8,
    backgroundColor: ownerColors.GRAY_LIGHT, // Added background
  },
  selectedDay: {
    backgroundColor: ownerColors.PRIMARY,
  },
  dayName: {
    fontSize: 12, // Reduced from 14
    fontWeight: 'bold',
    color: ownerColors.TEXT_PRIMARY,
  },
  dayDate: {
    fontSize: 14, // Reduced from 16
    marginTop: 4, // Reduced from 5
    color: ownerColors.TEXT_PRIMARY,
  },
  selectedDayText: {
    color: ownerColors.WHITE,
  },
  dateContainer: {
    padding: 12, // Reduced from 15
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
    padding: 20, // Reduced from 40
  },
  noSlotsText: {
    fontSize: 16,
    color: ownerColors.GRAY_DARK,
    marginTop: 16,
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
    padding: 20, // Reduced from 30
  },
  noGroundText: {
    fontSize: 18,
    color: ownerColors.GRAY_DARK,
    marginVertical: 16, // Reduced from 20
  },
  createButton: {
    width: '70%',
  },
});
