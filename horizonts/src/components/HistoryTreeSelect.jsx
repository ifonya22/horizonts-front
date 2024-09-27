import React, { useState, useEffect } from 'react';
import { TreeSelect } from 'antd';
import FactoryButton from '../components/FactoryButton';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;
const ObjectsTreeSelect = ({ selectedFactory, onSelect }) => {
  const [treeData, setTreeData] = useState([]);
  const [value, setValue] = useState([]);

  useEffect(() => {
    if (!selectedFactory) return;

    const fetchObjects = async () => {
      try {
        const username = localStorage.getItem('username');
        const response = await axios.get(`http://${apiUrl}/api/v1/firm/${selectedFactory}/objects_list/`, {headers: {'Username': username}});
        setTreeData(response.data);
      } catch (error) {
        console.error('Error fetching objects:', error);
      }
    };

    fetchObjects();
  }, [selectedFactory]);

  const handleChange = (newValue) => {
    setValue(newValue);
    onSelect(newValue); // Обновляем выбранные значения
  };

  const handleSelect = (selectedValue, node) => {
    // Если выбран цех, выберем или снимем выбор со всех его дочерних элементов
    if (node.children && node.children.length > 0) {
      const allChildrenValues = node.children.map(child => child.value);

      if (value.includes(selectedValue)) {
        // Если цех был снят с выбора — убираем все его дочерние элементы
        const newValue = value.filter(val => !allChildrenValues.includes(val));
        setValue(newValue);
        onSelect(newValue); // Обновляем выбранные значения
      } else {
        // Если цех выбран — добавляем все дочерние элементы
        const newValue = [...value, ...allChildrenValues];
        setValue(newValue);
        onSelect(newValue); // Обновляем выбранные значения
      }
    } else {
      // Добавляем или удаляем отдельный элемент
      const newValue = value.includes(selectedValue) 
        ? value.filter(val => val !== selectedValue) 
        : [...value, selectedValue];

      setValue(newValue);
      onSelect(newValue); // Обновляем выбранные значения
    }
  };

  return (
    <TreeSelect
      showSearch
      style={{
        width: '100%',
      }}
      value={value}
      dropdownStyle={{
        maxHeight: 400,
        overflow: 'auto',
      }}
      placeholder="Выберите оборудование"
      allowClear
      multiple
      treeDefaultExpandAll
      onChange={handleChange} // Обработчик изменения
      onSelect={handleSelect} // Обработчик выбора узла
      treeData={treeData}
    />
  );
};

const HistoryTreeSelect = ({ onSelect }) => {
    const [selectedFactory, setSelectedFactory] = useState(null);
  
    return (
      <div>
        {/* Здесь должна быть реализация выбора завода */}
        <FactoryButton onSelect={setSelectedFactory} />
        {selectedFactory && (
          <ObjectsTreeSelect 
            selectedFactory={selectedFactory} 
            onSelect={onSelect} // Передаем onSelect из родительского компонента
          />
        )}
      </div>
    );
  };
  
  export default HistoryTreeSelect;
  
