(function () {
  angular.module('shiftCipher', []).controller('shiftCipherController', shiftCipherController);

  function shiftCipherController($scope, shiftCipherService) {
    var englishAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $scope.helloMessage = '';
    $scope.countReturnText = '';
    $scope.countInputText = '';
    $scope.newCountInputText = '';
    $scope.vigInputText = '';
    $scope.inputText = '';
    $scope.key = '';
    $scope.number = 0;
    $scope.maxNumber = '10000';
    $scope.startTimeL1;
    $scope.endTimeL1;
    $scope.timeSpendtL1;
    $scope.PrintGCD = function (a,b) {
    $scope.helloMessage = '';
      // code supplied by martin
      var r;
      while (b > 0) {
        r = a % b;
        a = b;
        b = r;
      }
      $scope.helloMessage = a;
    };
    $scope.PrintPrime = function () {
      $scope.newCountInputText = '';
      $scope.helloMessage = '';
      $scope.startTimeL1 = performance.now();
      for (var i = 2;i < $scope.maxNumber;i++) {
        for (var j = 2;j * j <= i;j++) {
          if ((i % j) == 0) {
            break;
          }
        }
        if ((j * j) > i) {
          $scope.newCountInputText += (i + ', ');
        }
      }
      $scope.endTimeL1 = performance.now();
      $scope.timeSpendtL1 = $scope.endTimeL1 - $scope.startTimeL1;
      $scope.helloMessage += 'L1   end: ' + $scope.endTimeL1 + '\n';
      $scope.helloMessage += 'L1 start: ' + $scope.startTimeL1 + '\n';
      $scope.helloMessage += 'L1  time: ' + $scope.timeSpendtL1 + ' Ms\n';
    };
    $scope.compute = function() {
      $scope.helloMessage = '';
      $scope.helloMessage = shiftCipher($scope.inputText.toLowerCase(),makeArray(englishAlphabet),$scope.number);
    };
    $scope.countOccur = function () {
      console.log($scope.countInputText);
      console.log($scope.newCountInputText);
      $scope.countReturnText = countString(englishAlphabet, $scope.countInputText.toLowerCase());
      $scope.newCountInputText = $scope.countInputText;
    };
    $scope.replaceAB = function (src, trg) {
//      console.log('src:' + src + ' trg:' + trg);
//      console.log($scope.newCountInputText);
      $scope.newCountInputText = $scope.newCountInputText.split(src).join(trg.toLowerCase());
      $scope.replaceSrc = '';
      $scope.replaceTrg = '';
//      console.log($scope.newCountInputText);
    };
    $scope.encrypt = function () {
      var keyArray = $scope.key.split(',').map(Number);
      var count = 0;
      var space = 0;
      $scope.helloMessage = '';
      for (var i = 0; ((i+count)-space) < $scope.vigInputText.length; i++) {
        console.log('$scope.vigInputText.length ' + $scope.vigInputText.length);
        console.log('count ' + count);
        console.log('i ' + i);
        console.log('space ' + space);
        for (var j = 0; j < keyArray.length && (j+count) < $scope.vigInputText.length; j++) {
          console.log('$scope.vigInputText[j+count] ' + $scope.vigInputText[j+count] + ' n: ' + keyArray[j] + ' idx: ' + (j + count));
          if ($scope.vigInputText[(j+count)+1] === ' ') {
            $scope.helloMessage += shiftCipher($scope.vigInputText[j+count].toLowerCase(),makeArray(englishAlphabet),keyArray[j]);
            $scope.helloMessage += ' ';
            count += 1;
            space += 1;
          }
          else {
            $scope.helloMessage += shiftCipher($scope.vigInputText[j+count].toLowerCase(),makeArray(englishAlphabet),keyArray[j]);
          }
        }
        count += keyArray.length;
      }
    };
    $scope.decrypt = function () {
      // key array is inspired from http://stackoverflow.com/questions/15677869/how-to-convert-a-string-of-numbers-to-an-array-of-numbers
      var keyArray = $scope.key.split(',').map(Number); // split the string by , and map(convert) it to a number
      var count = 0; // counter to help with running through the length of the input text
      var space = 0; // counter for spaces
      $scope.helloMessage = ''; // clear the message
      // run through the whole input text
      for (var i = 0; ((i+count)-space) < $scope.vigInputText.length; i++) {
        // run through all the keys in the key and apply the shift cipher function
        for (var j = 0; j < keyArray.length && (j+count) < $scope.vigInputText.length; j++) {
          // check if the next input char is a space
          if ($scope.vigInputText[(j+count)+1] === ' ') {
            $scope.helloMessage += shiftCipher($scope.vigInputText[j+count].toLowerCase(),makeArray(englishAlphabet),(keyArray[j] * -1)); // apply the shift cipher function and then apply a space to the text
            $scope.helloMessage += ' ';
            count += 1; // increment counters
            space += 1;
          }
          else { // if there are no spaces apply the shift cipher function
            $scope.helloMessage += shiftCipher($scope.vigInputText[j+count].toLowerCase(),makeArray(englishAlphabet),(keyArray[j] * -1)); // the keyArray[j] * -1 is to make the key negative
          }
        }
        count += keyArray.length; // increment the count with the length og the key
      }
    };

    function shiftCipher(inputMessage, arrayInput,shiftNumber) {
      var returnMessage = ''; // clear the return message
      var reg = new RegExp('[0-9]'); // instantiate a new regular expression matching 0-9(numbers)
      for (var i = 0;i < inputMessage.length;i++) { // run through the length of the input text
        var index = arrayInput.indexOf(inputMessage[i]); // set the index to the index of the current char (o-25)
        var newIndex = index + parseInt(shiftNumber); // calculate the shifted index
        // check if the new index is greater or equal to the length og the alphabet used
        // index (z) 25 shift +3, new index = 28; Ni= (3 + 25)-26 = 2(c) ;can optimize with modulus
        if (newIndex >= arrayInput.length) {newIndex = (((parseInt(shiftNumber) +  (arrayInput.indexOf(inputMessage[i]))) - arrayInput.length));}
        // check if the new index is less then 0
        // index (a) 0 shift -3, new index = -3; Ni = (-3 + 26) = 23(x)
        if (newIndex < 0) {newIndex = (newIndex +  (arrayInput.length));}
        if (inputMessage[i] === ' ') { // check if it is a space and add it to the return string
          returnMessage += ' ';
        }
        else {
          if (inputMessage[i].match(reg)) { // if the input char matches the regex 0-9 then add that to the string
            returnMessage += inputMessage[i];
          }
          else { // else return the char at the new index
            returnMessage += arrayInput[newIndex];
          }
        }
      }
      return returnMessage;
    }

    function makeArray(alphabetString) {
      var tempArray = [];
      var i = 0;
      for (i = 0; i < alphabetString.length;i++) {
        tempArray.push(alphabetString[i].toLowerCase());
      }
      return tempArray;
    }

    function countString(alphabetString,countStringIn) {
      String.prototype.count = function (s1) {
        return (this.length - this.replace(new RegExp(s1,'g'), '').length) / s1.length;
      };
      var tempArray = makeArray(alphabetString);
      var tempArray1 = [];
      var returnString = '';
      var i = 0;
      for (i = 0;i < tempArray.length;i++) {
        tempArray1[i] = countStringIn.count(tempArray[i]);
        returnString += tempArray[i] + ':' + tempArray1[i] + ', ';
      }
      return returnString;
    }
  }
})();