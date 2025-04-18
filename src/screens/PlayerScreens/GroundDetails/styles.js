import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  noGroundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noGroundText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  backLink: {
    color: '#4A90E2',
    fontSize: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  backButtonText: {
    color: '#4A90E2',
    fontSize: 16,
    marginLeft: 5,
  },
  groundHeader: {
    marginBottom: 20,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    elevation: 2,
  },
  groundTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  groundLocation: {
    fontSize: 16,
    color: '#666',
    marginLeft: 5,
  },
  groundDescription: {
    fontSize: 14,
    color: '#777',
    marginBottom: 15,
    lineHeight: 20,
  },
  groundInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  dateSelector: {
    marginBottom: 15,
  },
  dateSelectorContent: {
    paddingHorizontal: 5,
  },
  dateButton: {
    alignItems: 'center',
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    width: 60,
  },
  selectedDateButton: {
    backgroundColor: '#4A90E2',
  },
  dayName: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'bold',
  },
  selectedDayName: {
    color: '#FFF',
  },
  dayNumber: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
  },
  selectedDayNumber: {
    color: '#FFF',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    paddingHorizontal: 5,
  },
  noSlotsContainer: {
    alignItems: 'center',
    padding: 30,
  },
  noSlotsText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
  slotsContainer: {
    paddingBottom: 20,
  },
});

export default styles;
