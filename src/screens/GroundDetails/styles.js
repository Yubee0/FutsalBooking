import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontSize: 16,
  },
  groundHeader: {
    padding: 16,
    paddingBottom: 8,
  },
  groundTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  groundLocation: {
    marginLeft: 4,
    fontSize: 14,
  },
  groundDescription: {
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
    fontSize: 14,
  },
  weekNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  navButton: {
    padding: 8,
  },
  weekRangeText: {
    fontWeight: 'bold',
  },
  dateSelector: {
    paddingVertical: 12,
    backgroundColor: 'white',
  },
  dateButton: {
    width: 60,
    alignItems: 'center',
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 8,
  },
  todayButton: {},
  selectedDateButton: {},
  dayName: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
  },
  selectedText: {},
  todayText: {},
  sectionTitle: {
    padding: 16,
    paddingBottom: 8,
    fontSize: 18,
    fontWeight: 'bold',
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
    marginTop: 16,
    marginBottom: 8,
  },
  noSlotsHint: {
    fontSize: 14,
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
    marginBottom: 16,
  },
  backLink: {
    fontSize: 16,
  },
});

export default styles;
