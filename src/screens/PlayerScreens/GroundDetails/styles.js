import {StyleSheet} from 'react-native';
import {playerColors} from '../../../constants/color';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: playerColors.BACKGROUND,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
  },
  backButtonText: {
    marginLeft: 8,
    color: playerColors.PRIMARY,
    fontSize: 16,
  },
  groundHeader: {
    padding: 16,
    paddingBottom: 8,
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
    marginLeft: 4,
    color: playerColors.TEXT_SECONDARY,
    fontSize: 14,
  },
  groundDescription: {
    color: playerColors.TEXT_SECONDARY,
    fontSize: 14,
    marginBottom: 12,
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
    marginLeft: 4,
    color: playerColors.TEXT_SECONDARY,
    fontSize: 14,
  },
  weekNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: playerColors.WHITE,
    borderTopWidth: 1,
    borderTopColor: playerColors.BORDER,
    borderBottomWidth: 1,
    borderBottomColor: playerColors.BORDER,
  },
  navButton: {
    padding: 8,
  },
  weekRangeText: {
    fontWeight: 'bold',
    color: playerColors.TEXT_PRIMARY,
  },
  dateSelector: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: playerColors.WHITE,
  },
  dateButton: {
    width: 50,
    alignItems: 'center',
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 8,
  },
  todayButton: {
    backgroundColor: playerColors.GRAY_LIGHT,
  },
  selectedDateButton: {
    backgroundColor: playerColors.PRIMARY,
  },
  dayName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: playerColors.TEXT_SECONDARY,
  },
  dayNumber: {
    fontSize: 16,
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
    padding: 16,
    paddingBottom: 8,
    fontSize: 18,
    fontWeight: 'bold',
    color: playerColors.TEXT_PRIMARY,
  },
  slotsContainer: {
    paddingHorizontal: 16,
  },
  noSlotsContainer: {
    alignItems: 'center',
    padding: 32,
  },
  noSlotsText: {
    fontSize: 16,
    color: playerColors.TEXT_PRIMARY,
    marginTop: 16,
    marginBottom: 8,
  },
  noSlotsHint: {
    fontSize: 14,
    color: playerColors.TEXT_SECONDARY,
    textAlign: 'center',
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
    padding: 32,
  },
  noGroundText: {
    fontSize: 18,
    color: playerColors.TEXT_PRIMARY,
    marginBottom: 16,
  },
  backLink: {
    color: playerColors.PRIMARY,
    fontSize: 16,
  },
});
