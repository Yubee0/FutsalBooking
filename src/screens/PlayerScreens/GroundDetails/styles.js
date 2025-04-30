// screens/player/GroundTimeSlotScreen/styles.js
import {StyleSheet} from 'react-native';
import {playerColors} from '../../../constants/color';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: playerColors.BACKGROUND,
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 80,
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
    padding: 24,
  },
  noGroundText: {
    fontSize: 18,
    color: playerColors.TEXT_PRIMARY,
    marginBottom: 16,
  },
  backLink: {
    color: playerColors.PRIMARY,
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  backButtonText: {
    color: playerColors.PRIMARY,
    fontSize: 16,
    marginLeft: 8,
  },
  groundHeader: {
    marginBottom: 20,
  },
  groundTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: playerColors.TEXT_PRIMARY,
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  groundLocation: {
    fontSize: 16,
    color: playerColors.TEXT_SECONDARY,
    marginLeft: 4,
  },
  groundDescription: {
    fontSize: 14,
    color: playerColors.TEXT_SECONDARY,
    marginBottom: 16,
  },
  groundInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: playerColors.TEXT_SECONDARY,
    marginLeft: 4,
  },
  weekNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  navButton: {
    padding: 8,
  },
  weekRangeText: {
    fontSize: 14,
    color: playerColors.TEXT_SECONDARY,
    fontWeight: '500',
  },
  dateSelector: {
    paddingBottom: 8,
  },
  dateButton: {
    width: 60,
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: playerColors.WHITE,
  },
  todayButton: {
    borderWidth: 1,
    borderColor: playerColors.PRIMARY,
  },
  selectedDateButton: {
    backgroundColor: playerColors.PRIMARY,
  },
  dayName: {
    fontSize: 14,
    color: playerColors.TEXT_SECONDARY,
    fontWeight: '500',
  },
  dayNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: playerColors.TEXT_PRIMARY,
    marginTop: 4,
  },
  selectedText: {
    color: playerColors.WHITE,
  },
  todayText: {
    color: playerColors.PRIMARY,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: playerColors.TEXT_PRIMARY,
    marginVertical: 16,
  },
  noSlotsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  noSlotsText: {
    fontSize: 16,
    color: playerColors.TEXT_SECONDARY,
    marginTop: 16,
    textAlign: 'center',
  },
  noSlotsHint: {
    fontSize: 14,
    color: playerColors.GRAY_LIGHT,
    marginTop: 8,
    textAlign: 'center',
  },
  slotsContainer: {
    marginBottom: 20,
  },
});

export default styles;
